import fs from 'fs/promises';
import path from 'path';
import cpy from 'cpy';
import merge from 'deepmerge';
import { globby } from 'globby';
import { JSDOM } from 'jsdom';
import { registerAssetHelper } from '../helpers/built-ins/paths.js';
import { parse as parseMarkdown } from '../utilities/markdown.js';
import { registerHelper, registerPartial, render } from '../utilities/template.js';
import { ConfigError } from './errors.js';
import { getHtmlFilename } from './file.js';
import type { DoxicityConfig, DoxicityPage } from '../utilities/types';

function checkConfig(config: DoxicityConfig) {
  // Check for an input directory
  if (!config.inputDir) {
    throw new ConfigError('No inputDir was specified in your config. Which files do you want to publish?');
  }

  // Check for an output directory
  if (!config.outputDir) {
    throw new ConfigError('No outputDir was specified in your config. Where do you want Doxicity to write the files?');
  }

  // Verify asset folder name
  if (!config.assetFolderName || config.assetFolderName.includes('/') || config.assetFolderName.includes('\\')) {
    throw new ConfigError(
      `Invalid assetFolderName: "${config.assetFolderName}". This must be a folder name, not a path.`
    );
  }

  // Verify theme folder name
  if (!config.themeFolderName || config.themeFolderName.includes('/') || config.themeFolderName.includes('\\')) {
    throw new ConfigError(
      `Invalid themeFolderName: "${config.themeFolderName}". This must be a folder name, not a path.`
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
      throw new Error(`Unable to clean the output directory: "${config.outputDir}"`);
    }
  }
}

/** Publishes files to the outputDir */
export async function publish(config: DoxicityConfig) {
  const publishedPages: DoxicityPage[] = [];

  checkConfig(config);

  // Register built-in helpers
  registerAssetHelper(config);

  // Register custom helpers and partials
  config.helpers.forEach(helper => registerHelper(helper.name, helper.callback));
  config.partials.forEach(partial => registerPartial(partial.name, partial.template));

  // Grab a list of markdown files from inputDir
  const sourceFiles = await globby(path.join(config.inputDir, '**/*.md'));

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

  return { publishedPages };
}

/** Copies assets to the asset folder */
export async function copyAssets(config: DoxicityConfig) {
  const assetDir = path.join(config.outputDir, config.assetFolderName);
  const filesToCopy = config.copyAssets.map(glob => path.resolve(config.inputDir, glob));

  checkConfig(config);

  await fs.mkdir(assetDir, { recursive: true });
  await cpy(filesToCopy, assetDir);
}

/** Copies theme files to the theme folder */
export async function copyTheme(config: DoxicityConfig) {
  const themeDir = path.join(config.outputDir, config.themeFolderName);

  checkConfig(config);

  await fs.mkdir(themeDir, { recursive: true });
  await cpy([path.join(config.themeDir, '**/*'), '!**/*.hbs'], themeDir);
}
