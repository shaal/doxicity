import path from 'path';
import type { DoxicityConfig } from './types';

/** Given a full file path, this function returns a root-relative URL. */
export function getRelativeUrl(config: DoxicityConfig, fullPath: string) {
  return path.relative(config.outputDir, fullPath);
}

/** Gets the output filename for an input markdown file. */
export function getHtmlFilename(config: DoxicityConfig, markdownFilename: string) {
  const { dir, name } = path.parse(markdownFilename);
  const outDir = path.join(config.outputDir, path.relative(config.inputDir, dir));
  return path.join(outDir, `${name}.html`);
}

export function isMarkdownFile(filename: string) {
  return filename.toLowerCase().endsWith('.md');
}
