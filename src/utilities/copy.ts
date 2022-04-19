import path from 'path';
import cpy from 'cpy';
import type { DoxicityConfig } from './types';

/** Copies files from a source directory to an output directory using globs. */
export async function copyFiles(globs: string[], config: DoxicityConfig): Promise<void> {
  const filesToCopy = globs.map(glob => path.join(config.inputDir, glob));
  const outputDir = path.join(config.outputDir, config.assetDirName);
  await cpy(filesToCopy, outputDir);
}
