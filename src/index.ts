import fs from 'fs/promises';
import path from 'path';
import merge from 'deepmerge';
import { globby } from 'globby';
import { JSDOM } from 'jsdom';
import { parse as parseMarkdown, render as renderMarkdown } from './utilities/markdown.js';
import { registerHelper, registerPartial, render } from './utilities/template.js';
import type { DoxicityConfig } from './utilities/types';

export const defaultConfig: DoxicityConfig = {
  inputDir: '',
  outputDir: '',
  templateDir: '',
  data: {},
  helpers: [],
  partials: [],
  plugins: []
};

export async function publish(userConfig: Partial<DoxicityConfig>) {
  const config = merge(defaultConfig, userConfig);
  const publishedFiles = [];

  // Check for an input directory
  if (!config.inputDir) {
    throw new Error('No inputDir was specified in your config. Which files should Doxicity process?');
  }

  // Check for an output directory
  if (!config.outputDir) {
    throw new Error('No outputDir was specified in your config. Where do you want Doxicity to write the files?');
  }

  // Register custom helpers and partials
  config.helpers.forEach(helper => registerHelper(helper.name, helper.callback));
  config.partials.forEach(partial => registerPartial(partial.name, partial.template));

  // Grab a list of markdown files from inputDir
  const sourceFiles = await globby(path.join(config.inputDir, '**/*.md'));

  // Loop through each file
  for (const file of sourceFiles) {
    const page = await parseMarkdown(file);
    const content = renderMarkdown(page.content);
    const templateName = typeof page.frontMatter.template === 'string' ? page.frontMatter.template : 'default';
    const templateData = merge(config.data, page.frontMatter);
    templateData.content = content;

    // Render the Handlebars template
    let html = await render(templateName, templateData, config);

    // Run transform plugins
    const doc = new JSDOM(html).window.document;
    for (const plugin of config.plugins) {
      if (plugin.transform) {
        plugin.transform(doc);
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
        html = plugin.afterTransform(html);
      }
    }

    // Write the file
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(outFile, html, 'utf8');

    publishedFiles.push({
      inputFile: file,
      outputFile: outFile,
      data: templateData
    });
  }

  return {
    publishedFiles
  };
}
