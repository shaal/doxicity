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
