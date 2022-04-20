/* eslint-disable @typescript-eslint/no-invalid-this */
import fs from 'fs/promises';
import path from 'path';
import { JSDOM } from 'jsdom';
import lunr from 'lunr';
import { pathToUrl } from '../../utilities/path.js';
import type { DoxicityPage, DoxicityPlugin } from 'src/utilities/types';

interface SearchResult {
  /** The page's title. */
  title: string;
  /** The page's description. */
  description: string;
  /** The pages root-relative URL. */
  url: string;
}

interface SearchOptions {
  /** Determines whether the specified page will be indexed or ignored. */
  ignore: (page: DoxicityPage) => boolean;
  /**
   * A function that fetches the page title you want to index from the DOM. By default, the plugin looks for an <h1> on
   * the page and falls back to the <title> element if no main heading is found. This will be shown in search results
   * and is also used to boost relevancy. This function should return a plain text title, not HTML.
   */
  getTitle: (doc: Document) => string;
  /**
   * A function that fetches the page description you want to index from the DOM. The description is added to
   * search.json so you can show it in search results. By default, it will be fetched from
   * <meta name="description"> if the tag exists. This function should return a plain text description, not HTML.
   */
  getDescription: (doc: Document) => string;
  /**
   * A function that fetches the headings you want to index from the DOM. Headings help boost relevancy in search
   * results. They're weighed in between titles and regular content. By default, <h2>, <h3>, and <h4> elements will be
   * indexed. This function should return an array of plain text headings, not HTML.
   */
  getHeadings: (doc: Document) => string[];
  /**
   * A function that fetches the content you want to index from the DOM. By default, this is derived from the <body>
   * element. This function should return plain text content, not HTML.
   */
  getContent: (doc: Document) => string;
  /**
   * The directory name to store the search index and script. Defaults to "search". This directory will always be
   * created under the assets directory.
   */
  searchDirName: string;
}

const map: SearchResult[] = [];

function stripWhitespace(string: string) {
  return string.replace(/\s+/g, ' ');
}

/** Makes in-page links scroll smoothly. */
export default function (options: Partial<SearchOptions>): DoxicityPlugin {
  let hasClientBeenCopied = false;

  options = {
    ignore: () => false,
    getTitle: doc => doc.querySelector('h1')?.textContent ?? doc.querySelector('title')?.textContent ?? '',
    getDescription: doc => doc.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
    getHeadings: doc => [...doc.querySelectorAll('h2, h3, h4')].map(heading => heading.textContent ?? ''),
    getContent: doc => doc.querySelector('body')?.textContent ?? '',
    searchDirName: 'search',
    ...options
  };

  return {
    // Bake the search script into each page and copy the search client
    transform: async (doc, config) => {
      const searchDir = path.join(config.outputDir, config.assetDirName, options.searchDirName!);
      const scriptFilename = path.join(searchDir, 'client.js');
      const stylesFilename = path.join(searchDir, 'client.css');

      // Copy the search client to the search dir
      if (!hasClientBeenCopied) {
        await fs.mkdir(path.dirname(scriptFilename), { recursive: true });
        await Promise.all([
          fs.copyFile('../src/plugins/search/client.js', scriptFilename),
          fs.copyFile('../src/plugins/search/client.css', stylesFilename)
        ]);
        hasClientBeenCopied = true;
      }

      // Append the script to each page
      const script = doc.createElement('script');
      script.src = pathToUrl(config, scriptFilename);
      script.type = 'module';
      doc.body.append(script);

      // Append the styles to each page
      const link = doc.createElement('link');
      link.rel = 'stylesheet';
      link.href = pathToUrl(config, stylesFilename);
      doc.head.append(link);

      return doc;
    },
    afterAll: (pages, config) => {
      const searchIndexFilename = path.join(
        config.outputDir,
        config.assetDirName,
        path.join(options.searchDirName!, 'search.json')
      );
      const searchIndex = lunr(async function () {
        let index = 0;

        // The search index uses these field names extensively, so shortening them can save some serious bytes in
        // search.json.
        this.ref('id'); // id
        this.field('t', { boost: 10 }); // title
        this.field('h', { boost: 5 }); // headings
        this.field('c'); // content

        for (const page of pages) {
          // Ignore this page?
          if (options.ignore!(page)) continue;

          const html = await fs.readFile(page.outputFile, 'utf8');
          const doc = new JSDOM(html).window.document;
          const title = stripWhitespace(options.getTitle!(doc));
          const description = stripWhitespace(options.getDescription!(doc));
          const headings = stripWhitespace(options.getHeadings!(doc).join(' '));
          const content = stripWhitespace(options.getContent!(doc));
          const url = pathToUrl(config, page.outputFile);

          this.add({ id: index, t: title, h: headings, c: content });
          map[index] = { title, description, url };
          index++;
        }

        // Write the search index
        await fs.mkdir(path.dirname(searchIndexFilename), { recursive: true });
        await fs.writeFile(searchIndexFilename, JSON.stringify({ searchIndex, map }), 'utf8');
      });
    }
  };
}
