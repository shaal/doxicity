import fs from 'fs/promises';
import path from 'path';
import cpy from 'cpy';
import merge from 'deepmerge';
import { globby } from 'globby';
import { JSDOM } from 'jsdom';
import { use as useHelper, registerAssetHelper, registerThemeHelper } from '../helpers/internal/internal.js';
import { themeDir } from '../index.js';
import { parse as parseMarkdown, render as renderMarkdown } from '../utilities/markdown.js';
import { registerHelper, registerPartial, render } from '../utilities/template.js';
import {
  CleanError,
  ConfigError,
  TransformPluginError,
  AfterTransformPluginError,
  AfterAllPluginError,
  TemplateRenderError
} from './errors.js';
import { getHtmlFilename } from './file.js';
import type { DoxicityConfig, DoxicityPage } from '../utilities/types';

function checkConfig(config: DoxicityConfig) {
  // Check for an input directory
  if (!config.inputDir) {
    throw new ConfigError('Invalid inputDir in your config. You need to tell Doxicity which files to process!');
  }

  // Check for an output directory
  if (!config.outputDir) {
    throw new ConfigError('Invalid outputDir in your config. You need to tell Doxicity where to publish your site!');
  }

  // Verify asset folder name
  if (!config.assetFolderName || config.assetFolderName.includes('/') || config.assetFolderName.includes('\\')) {
    throw new ConfigError(
      `Invalid assetFolderName in your config: "${config.assetFolderName}". This should be a folder name, not a path.`
    );
  }

  // Verify theme folder name
  if (!config.themeFolderName || config.themeFolderName.includes('/') || config.themeFolderName.includes('\\')) {
    throw new ConfigError(
      `Invalid themeFolderName in your config: "${config.themeFolderName}". This should be a folder name, not a path.`
    );
  }
}

/** Deletes the outputDir */
export async function clean(config: DoxicityConfig) {
  checkConfig(config);

  if (config.cleanOnPublish) {
    try {
      await fs.rm(config.outputDir, { recursive: true, force: true });
    } catch (err) {
      throw new CleanError(`Unable to clean the output directory: "${config.outputDir}"`);
    }
  }
}

/** Publishes files to the outputDir */
export async function publish(config: DoxicityConfig) {
  const publishedPages: DoxicityPage[] = [];

  checkConfig(config);

  // Register built-in helpers
  registerAssetHelper(config);
  registerThemeHelper(config);
  registerHelper('use', useHelper);

  // Register custom helpers and partials
  config.helpers.forEach(helper => registerHelper(helper.name, helper.callback));

  // Grab a list of markdown files from inputDir. Partials are identified by a preceding underscore, e.g. _partial.md.
  // All other files will be turned into pages.
  const [partialFiles, pageFiles] = await Promise.all([
    globby(path.join(config.inputDir, '**/_*.md')),
    globby(path.join(config.inputDir, '**/[^_]*.md'))
  ]);

  // Register partials
  for (const file of partialFiles) {
    const dirName = path.dirname(file);
    const baseName = path.basename(file).replace(/^_/, '').replace(/\.md$/, '');
    // Use path.posix.join() to ensure we always get a forward slash for partials inside folders
    const name = path.posix.join(path.relative(config.inputDir, dirName), baseName);

    if (name) {
      const { content } = await parseMarkdown(file);
      try {
        const html = renderMarkdown(content, { preserveHandlebars: true });
        registerPartial(name, html);
      } catch (err) {
        throw new Error(`Unable to prerender partial from "${file}": ${(err as Error).message}`);
      }
    }
  }

  // Loop through each file
  for (const file of pageFiles) {
    const { content, frontMatter } = await parseMarkdown(file);
    const templateData = merge(config.data, frontMatter);
    const outFile = getHtmlFilename(config, file);
    const { pathname } = new URL(`https://internal/${path.relative(config.outputDir, outFile)}`);
    let html = '';
    templateData.content = content;

    // Create a Doxicity page object for this page. This will be passed to plugins and used to populate an array of
    // published pages later on.
    const page: DoxicityPage = {
      pathname,
      inputFile: file,
      outputFile: outFile,
      data: templateData
    };

    // Render the Handlebars template
    try {
      html = await render(page, templateData, config);
    } catch (err: Error | unknown) {
      throw new TemplateRenderError(page, (err as Error).message);
    }

    // Parse the template and get a Document object
    const doc = new JSDOM(html, {
      // We must set a default URL so links are parsed with a hostname. Let's use a bogus TLD so we can identify which
      // links are internal and which links are external.
      url: `https://internal/`
    }).window.document;

    // Run transform plugins
    for (const plugin of config.plugins) {
      if (plugin.transform) {
        try {
          await plugin.transform(doc, page, config);
        } catch (err) {
          throw new TransformPluginError(page, (err as Error).message);
        }
      }
    }

    // Serialize the Document object to HTML
    html = doc.documentElement.outerHTML;

    // Run afterTransform plugins
    for (const plugin of config.plugins) {
      if (plugin.afterTransform) {
        try {
          html = await plugin.afterTransform(html, page, config);
        } catch (err) {
          throw new AfterTransformPluginError(page, (err as Error).message);
        }
      }
    }

    // Write the file
    await fs.mkdir(path.dirname(outFile), { recursive: true });
    await fs.writeFile(outFile, html, 'utf8');

    publishedPages.push(page);
  }

  // Run afterAll plugins
  for (const plugin of config.plugins) {
    if (plugin.afterAll) {
      try {
        await plugin.afterAll(publishedPages, config);
      } catch (err) {
        throw new AfterAllPluginError(publishedPages, (err as Error).message);
      }
    }
  }

  return { publishedPages };
}

/** Copies assets to the asset folder */
export async function copyAssets(config: DoxicityConfig) {
  const targetDir = path.join(config.outputDir, config.assetFolderName);
  const filesToCopy = config.copyAssets.map(glob => path.resolve(config.inputDir, glob));

  checkConfig(config);

  await fs.mkdir(targetDir, { recursive: true });
  await cpy(filesToCopy, targetDir);
}

/** Copies theme files to the theme folder */
export async function copyTheme(config: DoxicityConfig) {
  const targetDir = path.join(config.outputDir, config.themeFolderName);

  checkConfig(config);

  await fs.mkdir(targetDir, { recursive: true });
  await cpy([path.join(themeDir, '**/*'), '!**/*.hbs'], targetDir);
}
