import fs from 'fs/promises';
import path from 'path';
import { URL } from 'url'; // in Browser, the URL in native accessible on window
import Handlebars from 'handlebars';
import type { DoxicityConfig } from './types';
import type { TemplateDelegate } from 'handlebars';

const currentDir = new URL('.', import.meta.url).pathname;
const templateCache = new Map<string, TemplateDelegate>();

/** Renders a template and returns the resulting HTML. */
export async function render(
  templateName: string,
  data: Record<string, unknown>,
  config: DoxicityConfig
): Promise<string> {
  const source = await resolve(templateName, [path.join(currentDir, '../../templates'), config.templateDir]);
  let template: TemplateDelegate;

  // Cache templates for better performance
  if (templateCache.has(templateName)) {
    template = templateCache.get(templateName)!;
  } else {
    template = Handlebars.compile(source);
    templateCache.set(templateName, template);
  }

  // Sub-render the page content, since the markdown is allowed contain Handlebars
  const contentTemplate = Handlebars.compile(data.content);
  data.content = contentTemplate(Object.assign(data, { content: undefined }));

  return template(data);
}

/**
 * Looks for the specified template name in the user's templates directory, then falls back to the default template
 * directory. Returns the template's source.
 */
async function resolve(templateName: string, templateDirs: string[]) {
  for (const dir of templateDirs) {
    if (!dir) continue;

    try {
      const file = path.join(dir, `${templateName}.hbs`);
      const source = await fs.readFile(file, 'utf8');
      return source;
    } catch {
      // Not found, skip to the next one
    }
  }

  throw new Error(`Unable to resolve template "${templateName}"`);
}

/** Registers a custom Handlebars helper. */
export function registerHelper(name: string, callback: (args: unknown) => string) {
  Handlebars.registerHelper(name, callback);
}
