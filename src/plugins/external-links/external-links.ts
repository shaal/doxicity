import { isExternalLink } from '../../utilities/file.js';
import type { DoxicityPlugin } from 'src/utilities/types';

interface ExternalLinkOptions {
  /** Adds a small external link icon to external links. */
  addIcon: boolean;
  /** The class name to add to external links. Defaults to 'external-link'. */
  className: string;
  /** Adds rel="noopener" to all external links. */
  noopener: boolean;
  /** Adds rel="noreferrer" to all external links. */
  noreferrer: boolean;
  /** The SVG icon to use for external links. */
  iconSvg: string;
  /** Adds a target to external links. */
  target: '_blank' | '_self' | '_parent' | '_top' | string;
}

/** Transforms external links to make them safer and optionally add a target. */
export default function (options: Partial<ExternalLinkOptions>): DoxicityPlugin {
  const opts: ExternalLinkOptions = {
    addIcon: true,
    className: 'external-link',
    noopener: true,
    noreferrer: true,
    iconSvg: `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"></path>
        <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"></path>
      </svg>
    `,
    target: '',
    ...options
  };

  return {
    transform: doc => {
      doc.querySelectorAll('a').forEach((link: HTMLAnchorElement) => {
        if (isExternalLink(link)) {
          link.classList.add(opts.className);

          const rel = [];
          if (opts.noopener) rel.push('noopener');
          if (opts.noreferrer) rel.push('noreferrer');

          if (rel.length) {
            link.setAttribute('rel', rel.join(' '));
          }

          if (opts.target) {
            link.setAttribute('target', opts.target);
          }

          if (opts.addIcon) {
            const div = doc.createElement('div');
            div.innerHTML = opts.iconSvg!;
            const svg = div.querySelector('svg')!;
            svg.classList.add(`${opts.className}__icon`);
            link.append(svg);
          }
        }
      });

      return doc;
    }
  };
}
