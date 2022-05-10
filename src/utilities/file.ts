import path from 'path';
import type { DoxicityConfig } from './types';

/** Given a full file path, this function returns a root-relative URL. */
export function getRelativeUrl(config: DoxicityConfig, fullPath: string) {
  return `/${path.relative(config.outputDir, fullPath)}`;
}

/** Gets the output filename for an input markdown file. */
export function getHtmlFilename(config: DoxicityConfig, markdownFilename: string) {
  const { dir, name } = path.parse(markdownFilename);
  const outDir = path.join(config.outputDir, path.relative(config.inputDir, dir));
  return path.join(outDir, `${name}.html`);
}

/** Determines whether or not a link is external. */
export function isExternalLink(link: HTMLAnchorElement) {
  // We use the "internal" hostname when initializing JSDOM so we know that those are local links
  if (!link.hostname || link.hostname === 'internal') return false;
  return true;
}

/** Determines whether or not a file is a markdown file using its extension. */
export function isMarkdownFile(filename: string) {
  return filename.toLowerCase().endsWith('.md');
}

/** Normalizes a pathname by ensuring it starts with a slash and doesn't end with /index.html */
export function normalizePathname(pathname: string) {
  pathname = pathname.trim();

  // Make sure the path starts with a slash
  if (!pathname.startsWith('/')) {
    pathname = `/${pathname}`;
  }

  if (pathname.endsWith('/index.html')) {
    pathname = pathname.slice(0, -10);
  }

  return pathname;
}
