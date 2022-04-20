import path from 'path';
import type { DoxicityConfig } from './types';

/** Given a full file path, this function returns a root-relative URL. */
export function pathToUrl(config: DoxicityConfig, fullPath: string) {
  return path.relative(config.outputDir, fullPath);
}

/** Gets the output filename for an input file. */
export function getOutputFilename(config: DoxicityConfig, inputFilename: string) {
  const { dir, name } = path.parse(inputFilename);
  const outDir = path.join(config.outputDir, path.relative(config.inputDir, dir));
  return path.join(outDir, `${name}.html`);
}
