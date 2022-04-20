import fs from 'fs/promises';
import path from 'path';
import merge from 'deepmerge';
import { globby } from 'globby';
import { JSDOM } from 'jsdom';
import { registerAssetPathHelper } from './helpers/built-ins/paths.js';
import { copyFiles } from './utilities/copy.js';
import { parse as parseMarkdown } from './utilities/markdown.js';
import { registerHelper, registerPartial, render } from './utilities/template.js';
import type { DoxicityConfig, DoxicityPage } from './utilities/types';

export const defaultConfig: DoxicityConfig = {
  assetDirName: 'assets',
  inputDir: '',
  outputDir: '',
  templateDir: '',
  copyFiles: ['assets/**/*'],
  data: {},
  helpers: [],
  partials: [],
  plugins: []
};

export async function publish(userConfig: Partial<DoxicityConfig>) {
  const config = merge(defaultConfig, userConfig);
  const publishedPages: DoxicityPage[] = [];

  // Check for an input directory
  if (!config.inputDir) {
    throw new Error('No inputDir was specified in your config. Which files should Doxicity process?');
  }

  // Check for an output directory
  if (!config.outputDir) {
    throw new Error('No outputDir was specified in your config. Where do you want Doxicity to write the files?');
  }

  // Register built-in helpers
  registerAssetPathHelper(config);

  // Register custom helpers and partials
  config.helpers.forEach(helper => registerHelper(helper.name, helper.callback));
  config.partials.forEach(partial => registerPartial(partial.name, partial.template));

  // Grab a list of markdown files from inputDir
  const sourceFiles = await globby(path.join(config.inputDir, '**/*.md'));

  // Copy files to assets
  await copyFiles(config.copyFiles, config);

  // Loop through each file
  for (const file of sourceFiles) {
    const page = await parseMarkdown(file);
    const templateName = typeof page.frontMatter.template === 'string' ? page.frontMatter.template : 'default';
    const templateData = merge(config.data, page.frontMatter);
    templateData.content = page.content;

    // Render the Handlebars template
    let html = await render(templateName, templateData, config);

    // Run transform plugins
    const doc = new JSDOM(html).window.document;
    for (const plugin of config.plugins) {
      if (plugin.transform) {
        await plugin.transform(doc, config);
      }
    }
    html = doc.documentElement.outerHTML;

    // Determine where the file will be written to
    const { dir, name } = path.parse(file);
    const outDir = path.join(config.outputDir, path.relative(config.inputDir, dir));
    const outFile = path.join(outDir, `${name}.html`);

    // Run afterTransform plugins
    for (const plugin of config.plugins) {
      if (plugin.afterTransform) {
        html = await plugin.afterTransform(html, config);
      }
    }

    // Write the file
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(outFile, html, 'utf8');

    publishedPages.push({
      inputFile: file,
      outputFile: outFile,
      data: templateData
    });
  }

  // Run afterAll plugins
  for (const plugin of config.plugins) {
    if (plugin.afterAll) {
      await plugin.afterAll(publishedPages, config);
    }
  }

  return {
    publishedPages
  };
}
