import { isExternalLink, normalizePathname } from '../../utilities/file.js';
import type { DoxicityPlugin } from '../../utilities/types';

interface SafeLinksOptions {
  /** The class to apply to active links. Defaults to "active-link". */
  className: string;
  /** A selector targeting the containers to look for links within. Defaults to "body". */
  within: string;
}

/** Transforms external links to make them safer and optionally add a target. */
export default function (options: Partial<SafeLinksOptions>): DoxicityPlugin {
  const opts: SafeLinksOptions = {
    className: 'active-link',
    within: 'body',
    ...options
  };

  return {
    transform: (doc, page) => {
      doc.querySelectorAll(opts.within).forEach(el => {
        el.querySelectorAll('a').forEach(link => {
          // Ignore external links
          if (isExternalLink(link)) {
            return;
          }

          // Do the links match?
          if (normalizePathname(link.pathname) === normalizePathname(page.pathname)) {
            link.classList.add(opts.className);
          }
        });
      });

      return doc;
    }
  };
}
