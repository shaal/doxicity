/* @ts-expect-error - no types */
import smartquotes from 'smartquotes';
import type { DoxicityPlugin } from 'src/utilities/types';

/* eslint-disable */
smartquotes.replacements.push([/\-\-\-/g, '\u2014']); // em dash
smartquotes.replacements.push([/\-\-/g, '\u2013']); // en dash
smartquotes.replacements.push([/\.\.\./g, '\u2026']); // ellipses
/* eslint-enable */

interface SmartQuotesOptions {
  /** A selector that matches one or more elements to apply smart quotes to. Defaults to "main". */
  selector: string;
}

/** Adds smart quotes and some typography enhancements to selected content. */
export default function (options: Partial<SmartQuotesOptions>): DoxicityPlugin {
  options = {
    selector: 'main',
    ...options
  };

  return {
    transform: doc => {
      const elements = [...doc.querySelectorAll(options.selector!)];
      // eslint-disable-next-line
      elements.forEach(el => smartquotes.element(el));
      return doc;
    }
  };
}
