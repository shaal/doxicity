import path from 'path';
import { registerHelper } from '../../utilities/template.js';
import type { DoxicityConfig } from '../../utilities/types';

/** Registers the {{assetPath}} built-in helper. */
export function registerAssetPathHelper(config: DoxicityConfig) {
  const callback = (filename: string) => {
    const fullPath = path.join(config.outputDir, config.assetDirName, filename);
    return path.relative(config.outputDir, fullPath);
  };

  registerHelper('assetPath', callback);
}
