import beautify from 'js-beautify';
import type { HTMLBeautifyOptions } from 'js-beautify';
import type { DoxicityPlugin } from 'src/utilities/types';

/** The Doxicity beautify plugin. */
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
