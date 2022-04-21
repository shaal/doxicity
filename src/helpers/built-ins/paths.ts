import path from 'path';
import { getRelativeUrl } from '../../utilities/path.js';
import { registerHelper } from '../../utilities/template.js';
import type { DoxicityConfig } from '../../utilities/types';

/** Registers the {{asset}} helper. */
export function registerAssetHelper(config: DoxicityConfig) {
  const callback = (filename: string) => {
    const fullPath = path.join(config.outputDir, config.assetDirName, filename);
    return getRelativeUrl(config, fullPath);
  };

  registerHelper('asset', callback);
}
