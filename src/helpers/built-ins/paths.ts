import path from 'path';
import { getRelativeUrl } from '../../utilities/file.js';
import { registerHelper } from '../../utilities/template.js';
import type { DoxicityConfig } from '../../utilities/types.js';

/** Registers the {{assetPath}} helper. */
export function registerAssetHelper(config: DoxicityConfig) {
  const callback = (filename: string) => {
    const fullPath = path.join(config.outputDir, config.assetFolderName, filename);
    return getRelativeUrl(config, fullPath);
  };

  registerHelper('assetPath', callback);
}

/** Registers the {{themePath}} helper. */
export function registerThemeHelper(config: DoxicityConfig) {
  const callback = (filename: string) => {
    const fullPath = path.join(config.outputDir, config.themeFolderName, filename);
    return getRelativeUrl(config, fullPath);
  };

  registerHelper('themePath', callback);
}
