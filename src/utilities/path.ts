import path from 'path';
import type { DoxicityConfig } from './types';

/** Given a full file path, this function returns a root-relative URL. */
export function pathToUrl(config: DoxicityConfig, fullPath: string) {
  return path.relative(config.outputDir, fullPath);
}
