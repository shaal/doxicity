/* @ts-expect-error - no types */
import smartquotes from 'smartquotes';
import type { DoxicityPlugin } from 'src/utilities/types';

interface TypographyOptions {
  /** A selector that matches one or more elements to apply smart quotes to. Defaults to "main". */
  selector: string;
}

/* eslint-disable */
// Add custom conversions (https://github.com/kellym/smartquotes.js/issues/28#issuecomment-334602454)
smartquotes.replacements.push([/\-\-\-/g, '\u2014']); // em dash
smartquotes.replacements.push([/\-\-/g, '\u2013']); // en dash
smartquotes.replacements.push([/\.\.\./g, '\u2026']); // ellipsis
smartquotes.replacements.push([/\(c\)/gi, '\u00A9']); // copyright
smartquotes.replacements.push([/\(r\)/gi, '\u00AE']); // registered trademark
smartquotes.replacements.push([/\?!/g, '\u2048']); // ?!
smartquotes.replacements.push([/!!/g, '\u203C']); // !!
smartquotes.replacements.push([/\?\?/g, '\u2047']); // ??
smartquotes.replacements.push([/([0-9]\s?)\-(\s?[0-9])/g, '$1\u2013$2']); // number ranges use en dash
/* eslint-enable */

/** Adds smart quotes and some typography enhancements to selected content. */
export default function (options: Partial<TypographyOptions>): DoxicityPlugin {
  const opts: TypographyOptions = {
    selector: 'main',
    ...options
  };

  return {
    transform: doc => {
      const elements = [...doc.querySelectorAll(opts.selector)];
      // eslint-disable-next-line
      elements.forEach(el => smartquotes.element(el));
      return doc;
    }
  };
}
