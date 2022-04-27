import { isExternalLink } from '../../utilities/file.js';
import type { DoxicityPlugin } from 'src/utilities/types';

interface ExternalLinkOptions {
  /** Adds rel="noopener" to all external links. */
  noopener: boolean;
  /** Adds rel="noreferrer" to all external links. */
  noreferrer: boolean;
  /** Adds a target to external links. */
  target: '_blank' | '_self' | '_parent' | '_top' | string;
}

/** Transforms external links to make them safer and optionally add a target. */
export default function (options: Partial<ExternalLinkOptions>): DoxicityPlugin {
  options = {
    noopener: true,
    noreferrer: true,
    target: undefined,
    ...options
  };

  return {
    transform: doc => {
      doc.querySelectorAll('a').forEach((link: HTMLAnchorElement) => {
        if (isExternalLink(link)) {
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
