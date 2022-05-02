import { randomUUID } from 'crypto';
import { createSlug } from '../../utilities/slug.js';
import type { DoxicityPlugin } from 'src/utilities/types';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface AnchorHeadingsOptions {
  /** The heading levels to add anchors to. Defaults to all levels, e.g. h1, h2, h3, h4, h5, h6. */
  levels: HeadingLevel[];
  /** The class name to add to the anchor. */
  className: string;
  /** A CSS selector that points to an element that contains the headings to process. Defaults to "main". */
  within: string;
}

/** Converts headings to anchors for easier deep linking. */
export default function (options: Partial<AnchorHeadingsOptions>): DoxicityPlugin {
  const opts: AnchorHeadingsOptions = {
    levels: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    className: 'anchor-heading',
    within: 'main',
    ...options
  };

  return {
    transform: doc => {
      const within = doc.querySelector(opts.within);

      if (!within) {
        return doc;
      }

      within.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading: HTMLElement) => {
        const hasAnchor = heading.querySelector('a');
        const anchor = doc.createElement('a');
        const slug = createSlug(heading.textContent ?? '') ?? randomUUID().slice(-12);
        let id = slug;
        let suffix = 0;

        // Ensure the id is unique
        while (doc.getElementById(id) !== null) {
          id = `${slug}-${++suffix}`;
        }

        if (hasAnchor || !id) return;

        heading.setAttribute('id', id);
        anchor.setAttribute('href', `#${encodeURIComponent(id)}`);
        if (opts.className) {
          anchor.classList.add(opts.className);
        }

        // Wrap the interior of the heading with the link
        if (opts.levels?.includes(heading.tagName.toLowerCase() as HeadingLevel)) {
          const headingHtml = heading.innerHTML;
          anchor.innerHTML = headingHtml;
          heading.innerHTML = anchor.outerHTML;
        }
      });

      return doc;
    }
  };
}
