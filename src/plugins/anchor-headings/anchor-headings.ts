import slugify from 'slugify';
import type { DoxicityPlugin } from 'src/utilities/types';

interface AnchorHeadingsOptions {
  tags: string[];
  className: string;
}

/** Converts headings to anchors for easier deep linking. */
export default function (options: Partial<AnchorHeadingsOptions>): DoxicityPlugin {
  options = {
    /** The tags to add anchors to. */
    tags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    /** The class name to add to the anchor. */
    className: 'anchor-heading',
    ...options
  };

  return {
    transform: doc => {
      doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading: HTMLElement) => {
        const anchor = doc.createElement('a');
        const slug = slugify(heading.textContent ?? '', {
          remove: /[^\w|\s]/g,
          lower: true
        });

        if (!slug) return;

        heading.setAttribute('id', slug);
        anchor.setAttribute('href', `#${encodeURIComponent(slug)}`);
        if (options.className) {
          anchor.classList.add(options.className);
        }

        // Wrap the interior of the heading with the link
        if (options.tags?.includes(heading.tagName.toLowerCase())) {
          const headingHtml = heading.innerHTML;
          anchor.innerHTML = headingHtml;
          heading.innerHTML = anchor.outerHTML;
        }
      });

      return doc;
    }
  };
}
