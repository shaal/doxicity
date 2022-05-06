import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import Handlebars from 'handlebars';
import { themeDir } from '../index.js';
import { TemplateRenderError } from './errors.js';
import { render as renderMarkdown } from './markdown.js';
import type { DoxicityConfig, DoxicityPage } from './types';
import type { TemplateDelegate } from 'handlebars';

const templateCache = new Map<string, TemplateDelegate>();

/** Renders a template and returns the resulting HTML. */
export async function render(
  page: DoxicityPage,
  data: Record<string, unknown>,
  config: DoxicityConfig
): Promise<string> {
  // Originally, the idea was to allow more than one template in a theme. This probably isn't necessary anymore given
  // how the app has evolved, but I'm leaving the caching logic intact in case we want to allow this in the future.
  const templateName = 'default';
  const file = path.join(themeDir, `${templateName}.hbs`);
  const source = await fs.readFile(file, 'utf8');
  const filename = path.relative(config.inputDir, page.inputFile);
  let template: TemplateDelegate;

  // Cache the template for better performance
  if (templateCache.has(templateName) && !config.dev) {
    template = templateCache.get(templateName)!;
  } else {
    template = Handlebars.compile(source);
    templateCache.set(templateName, template);
  }

  // Sub-render page content and its markdown
  try {
    const contentTemplate = Handlebars.compile(data.content);
    data.content = renderMarkdown(contentTemplate(Object.assign(data, { content: undefined })));
  } catch (err) {
    throw new TemplateRenderError(
      page,
      `Unable to render content from "${filename}":\n\n${chalk.yellow(err as string)}`
    );
  }

  // Render the template
  try {
    return template(data);
  } catch (err) {
    throw new TemplateRenderError(
      page,
      `Unable to render template "${templateName}" in "${filename}":\n\n${chalk.yellow(err as string)}`
    );
  }
}

/** Registers a custom Handlebars helper. */
export function registerHelper(name: string, callback: (args: unknown) => string) {
  Handlebars.registerHelper(name, callback);
}

/** Registers a custom Handlebars partial. */
export function registerPartial(name: string, htmlTemplate: string) {
  Handlebars.registerPartial(name, htmlTemplate);
}
