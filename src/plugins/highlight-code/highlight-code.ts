import Prism from 'prismjs';
import PrismLoader from 'prismjs/components/index.js';
import type { DoxicityPlugin } from 'src/utilities/types';

interface HighlightCodeOptions {
  /**
   * By default, an error will be thrown and publishing will be interrupted when an unknown language is found in a code
   * field. Enabling this option will skip highlighting for unknown languages and allow publishing to continue.
   */
  ignoreMissingLangs: boolean;
}

PrismLoader('diff');
PrismLoader.silent = true;

/** Highlights a code string. */
export function highlight(code: string, language: string): string {
  const alias = language.replace(/^diff-/, '');
  const isDiff = /^diff-/i.test(language);

  // Auto-load the target language
  if (!Prism.languages[alias]) {
    PrismLoader(alias);

    if (!Prism.languages[alias]) {
      throw new Error(`Unsupported language for code highlighting: "${language}"`);
    }
  }

  // Register diff-* languages to use the diff grammar
  if (isDiff) {
    Prism.languages[language] = Prism.languages.diff;
  }

  return Prism.highlight(code, Prism.languages[language], language);
}

/**
 * The Doxicity highlight plugin. This plugin will highlight all code fields that have a language parameter. Languages
 * are automatically loaded, so all you need to do is add this plugin to your Doxicity config and then add a CSS theme
 * to your website. Prism themes can be found here: https://github.com/PrismJS/prism-themes
 */
export default function (options: Partial<HighlightCodeOptions>): DoxicityPlugin {
  options = {
    ignoreMissingLangs: true,
    ...options
  };

  return {
    transform: doc => {
      doc.querySelectorAll('pre > code[class]').forEach((code: HTMLElement) => {
        // Look for class="language-*"
        code.classList.forEach(className => {
          if (className.startsWith('language-')) {
            const language = className.replace(/^language-/, '');

            try {
              code.innerHTML = highlight(code.textContent ?? '', language);
            } catch (err) {
              if (!options.ignoreMissingLangs) {
                throw new Error((err as Error).message);
              }
            }
          }
        });
      });

      return doc;
    }
  };
}
