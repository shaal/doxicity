import fs from 'fs/promises';
import path from 'path';
import cpy from 'cpy';
import merge from 'deepmerge';
import { globby } from 'globby';
import { JSDOM } from 'jsdom';
import { registerAssetHelper, registerThemeHelper } from '../helpers/built-ins/paths.js';
import { parse as parseMarkdown } from '../utilities/markdown.js';
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
    let html = '';
    templateData.content = parsed.content;

    // Create a Doxicity page object for this page. This will be passed to plugins and used to populate an array of
    // published pages later on.
    const page: DoxicityPage = {
      inputFile: file,
      outputFile: outFile,
      data: templateData
    };

    // Render the Handlebars template
    try {
      html = await render(page, templateName, templateData, config);
    } catch (err: Error | unknown) {
      throw new TemplateRenderError(page, (err as Error).message);
    }

    // Run transform plugins
    const doc = new JSDOM(html).window.document;
    for (const plugin of config.plugins) {
      if (plugin.transform) {
        try {
          await plugin.transform(doc, page, config);
        } catch (err) {
          throw new TransformPluginError(page, (err as Error).message);
        }
      }
    }
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
  const assetPath = path.join(config.outputDir, config.assetFolderName);
  const filesToCopy = config.copyAssets.map(glob => path.resolve(config.inputDir, glob));

  checkConfig(config);

  await fs.mkdir(assetPath, { recursive: true });
  await cpy(filesToCopy, assetPath);
}

/** Copies theme files to the theme folder */
export async function copyTheme(config: DoxicityConfig) {
  const themeDir = path.join(config.outputDir, config.themeFolderName);

  checkConfig(config);

  await fs.mkdir(themeDir, { recursive: true });
  await cpy([path.join(config.themeDir, '**/*'), '!**/*.hbs'], themeDir);
}
