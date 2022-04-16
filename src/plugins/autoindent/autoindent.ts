import beautify from 'js-beautify';
import type { HTMLBeautifyOptions } from 'js-beautify';
import type { DoxicityPlugin } from 'src/utilities/types';

export default function (options: Partial<HTMLBeautifyOptions>): DoxicityPlugin {
  return {
    postProcess: (html: string) => {
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
