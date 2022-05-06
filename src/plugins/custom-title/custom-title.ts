import type { DoxicityPage, DoxicityPlugin } from '../../utilities/types';

interface CustomTitleOptions {
  /** A prefix to apply to the <title> as a string of HTML. */
  prefix: string;
  /** A suffix to apply to the <title> as a string of HTML. */
  suffix: string;
  /**
   * A callback that accepts a DoxicityPage as its only argument and returns true if the page should be skipped or false
   * if the page should have a prefix/suffix.
   */
  skip: (page: DoxicityPage) => boolean;
}

/** Transforms external links to make them safer and optionally add a target. */
export default function (options: Partial<CustomTitleOptions>): DoxicityPlugin {
  const opts: CustomTitleOptions = {
    prefix: '',
    suffix: '',
    skip: () => false,
    ...options
  };

  return {
    transform: (doc, page) => {
      if (opts.skip(page)) {
        return doc;
      }

      const title = doc.querySelector('title');
      if (title) {
        title.innerHTML = `${opts.prefix}${title.innerHTML}${opts.suffix}`;
      }

      return doc;
    }
  };
}
