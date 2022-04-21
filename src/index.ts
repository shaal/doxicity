import fs from 'fs/promises';
import path from 'path';
import cpy from 'cpy';
import merge from 'deepmerge';
import { globby } from 'globby';
import { JSDOM } from 'jsdom';
import { registerAssetHelper } from './helpers/built-ins/paths.js';
import { parse as parseMarkdown } from './utilities/markdown.js';
import { getHtmlFilename } from './utilities/path.js';
import { registerHelper, registerPartial, render } from './utilities/template.js';
import type { DoxicityConfig, DoxicityPage } from './utilities/types';

export const defaultConfig: DoxicityConfig = {
  assetDirName: 'assets',
  cleanBeforePublish: true,
  copyFiles: ['assets/**/*'],
  data: {},
  helpers: [],
  inputDir: '',
  outputDir: '',
  partials: [],
  plugins: [],
  themeDir: path.resolve('../themes/default')
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

  // Verify asset dir name
  if (!config.assetDirName || config.assetDirName.includes('/') || config.assetDirName.includes('\\')) {
    throw new Error(`Invalid assetDirName: "${config.assetDirName}". This must be a folder name, not a path.`);
  }

  // Clean before publishing
  if (config.cleanBeforePublish) {
    await fs.rm(config.outputDir, { recursive: true });
  }

  // Register built-in helpers
  registerAssetHelper(config);

  // Register custom helpers and partials
  config.helpers.forEach(helper => registerHelper(helper.name, helper.callback));
  config.partials.forEach(partial => registerPartial(partial.name, partial.template));

  // Grab a list of markdown files from inputDir
  const sourceFiles = await globby(path.join(config.inputDir, '**/*.md'));

  // Copy files to assets
  await Promise.all([
    // Copy all theme files except for templates
    cpy([path.join(config.themeDir, '**/*'), '!**/*.hbs'], path.join(config.outputDir, config.assetDirName)),
    // Copy user files to assets
    cpy(config.copyFiles, path.join(config.outputDir, config.assetDirName))
  ]);

  // Loop through each file
  for (const file of sourceFiles) {
    const parsed = await parseMarkdown(file);
    const templateName = typeof parsed.frontMatter.template === 'string' ? parsed.frontMatter.template : 'default';
    const templateData = merge(config.data, parsed.frontMatter);
    const outFile = getHtmlFilename(config, file);
    templateData.content = parsed.content;

    // Create a Doxicity page object for this page. This will be passed to plugins and used to populate an array of
    // published pages later on.
    const page: DoxicityPage = {
      inputFile: file,
      outputFile: outFile,
      data: templateData
    };

    // Render the Handlebars template
    let html = await render(page, templateName, templateData, config);

    // Run transform plugins
    const doc = new JSDOM(html).window.document;
    for (const plugin of config.plugins) {
      if (plugin.transform) {
        await plugin.transform(doc, page, config);
      }
    }
    html = doc.documentElement.outerHTML;

    // Run afterTransform plugins
    for (const plugin of config.plugins) {
      if (plugin.afterTransform) {
        html = await plugin.afterTransform(html, page, config);
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
      await plugin.afterAll(publishedPages, config);
    }
  }

  return {
    publishedPages
  };
}
