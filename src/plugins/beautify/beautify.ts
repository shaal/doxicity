import beautify from 'js-beautify';
import type { HTMLBeautifyOptions } from 'js-beautify';
import type { DoxicityPlugin } from 'src/utilities/types';

/**
 * Beautifies markup by re-indenting and lightly reformatting the HTML. This plugin should run after all other
 * transformations to ensure it runs on the final version of the HTML.
 */
export default function (options: Partial<HTMLBeautifyOptions>): DoxicityPlugin {
  return {
    afterTransform: (html: string) => {
      return beautify.html(html, {
        indent_size: 2,
        indent_char: ' ',
        end_with_newline: true,
        extra_liners: [],
        ...options
      });
    }
  };
}
