// import indent from 'indent.js';
import type { DoxicityPlugin } from 'src/utilities/types';

interface AutoindentOptions {
  /** The string to use for each indentation. Use "\t" for tab, "  " for two spaces, etc. */
  tabString: string;
  indentHtmlTag: boolean;
}

export default function (options: Partial<AutoindentOptions>): DoxicityPlugin {
  return {
    postProcess: (html: string) => {
      console.log(options);
      return 'AUTOINDENTED ' + html;
      // return indent(indent.html, {
      //   tabString: '  ',
      //   indentHtmlTag: false,
      //   ...options
      // });
    }
  };
}
