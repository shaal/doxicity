import path from 'path';
import { pathToUrl } from '../../utilities/path.js';
import { registerHelper } from '../../utilities/template.js';
import type { DoxicityConfig } from '../../utilities/types';

/** Registers the {{assetPath}} built-in helper. */
export function registerAssetPathHelper(config: DoxicityConfig) {
  const callback = (filename: string) => {
    const fullPath = path.join(config.outputDir, config.assetDirName, filename);
    return pathToUrl(config, fullPath);
  };

  registerHelper('assetPath', callback);
}
