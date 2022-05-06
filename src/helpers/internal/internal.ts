import path from 'path';
import { getRelativeUrl } from '../../utilities/file.js';
import { registerHelper } from '../../utilities/template.js';
import type { DoxicityConfig } from '../../utilities/types';

/** Registers the {{asset}} helper. */
export function registerAssetHelper(config: DoxicityConfig) {
  const callback = (filename: string) => {
    const fullPath = path.join(config.outputDir, config.assetFolderName, filename);
    return getRelativeUrl(config, fullPath);
  };

  registerHelper('asset', callback);
}

/** Registers the {{theme}} helper. */
export function registerThemeHelper(config: DoxicityConfig) {
  const callback = (filename: string) => {
    const fullPath = path.join(config.outputDir, config.themeFolderName, filename);
    return getRelativeUrl(config, fullPath);
  };

  registerHelper('theme', callback);
}

/**
 * A block helper that uses the first truthy value in its arguments. If no value is truthy, nothing is rendered unless
 * an {{else}} block is provided.
 *
 * @example
 *
 * {{#use '' 'boom'}}
 *   {{this}} {{! outputs "boom" }}
 * {{/use}}
 *
 * {{#use '' ''}}
 *   {{this}}
 * {{else}}
 *   No value
 * {{/use}}
 */
export function use(...args: unknown[]): string {
  const argsToTest = args.slice(0, -1);
  const context = args.slice(-1)[0] as Handlebars.HelperOptions;

  for (const arg of argsToTest) {
    if (arg) {
      return context.fn(arg);
    }
  }

  return context.inverse('');
}
