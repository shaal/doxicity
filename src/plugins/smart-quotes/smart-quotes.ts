/* @ts-expect-error - no types */
import smartQuotes from 'smartquotes';
import type { DoxicityPlugin } from 'src/utilities/types';

interface SmartQuotesOptions {
  /** A selector that matches one or more elements to apply smart quotes to. Defaults to "main". */
  selector: string;
}

/** Adds smart quotes to selected content. */
export default function (options: Partial<SmartQuotesOptions>): DoxicityPlugin {
  options = {
    selector: 'main',
    ...options
  };

  return {
    transform: doc => {
      const elements = [...doc.querySelectorAll(options.selector!)];
      // eslint-disable-next-line
      elements.forEach(el => smartQuotes.element(el));
      return doc;
    }
  };
}
