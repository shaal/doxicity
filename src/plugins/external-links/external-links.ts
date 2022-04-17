import type { DoxicityPlugin } from 'src/utilities/types';

interface SafeLinksOptions {
  /** Adds rel="noopener" to all external links. */
  noopener: boolean;
  /** Adds rel="noreferrer" to all external links. */
  noreferrer: boolean;
  /** Adds a target to external links. */
  target: '_blank' | '_self' | '_parent' | '_top' | string;
  /**
   * A function that receives an href and returns true if the link is external. By default, links starting with http://
   * or https:// are considered external.
   */
  isExternal: (href: string) => boolean;
}

/** Transforms external links to make them safer and optionally add a target. */
export default function (options: Partial<SafeLinksOptions>): DoxicityPlugin {
  options = {
    isExternal: href => /^https?:\/\//.test(href),
    noopener: true,
    noreferrer: true,
    target: undefined,
    ...options
  };

  return {
    transform: doc => {
      doc.querySelectorAll('a').forEach((link: HTMLAnchorElement) => {
        if (options.isExternal!(link.href)) {
          const rel = [];
          if (options.noopener) rel.push('noopener');
          if (options.noreferrer) rel.push('noreferrer');

          if (rel.length) {
            link.setAttribute('rel', rel.join(' '));
          }

          if (options.target) {
            link.setAttribute('target', options.target);
          }
        }
      });

      return doc;
    }
  };
}
