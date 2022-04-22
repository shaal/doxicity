import type { DoxicityPlugin } from 'src/utilities/types';

interface CopyCodeOptions {
  /** The button's label, e.g. "Copy". */
  label: string;
}

/**
 * Appends a copy button to every code block. The button will be appended to the <pre> element containing the code. To
 * handle the copy functionality, a small script will be appended to the body.
 */
export default function (options: Partial<CopyCodeOptions>): DoxicityPlugin {
  options = {
    label: 'Copy',
    ...options
  };

  return {
    transform: doc => {
      let hasCodeBlock = false;

      doc.querySelectorAll('pre > code').forEach((code: HTMLElement) => {
        const pre = code.closest('pre')!;
        const button = doc.createElement('button');
        button.setAttribute('type', 'button');
        button.classList.add('copy-code-button');
        button.textContent = options.label!;
        pre.append(button);
        hasCodeBlock = true;
      });

      if (hasCodeBlock) {
        const script = doc.createElement('script');
        script.type = 'module';
        script.textContent = `
          document.addEventListener('click', event => {
            const button = event.target.closest('.copy-code-button');
            const pre = button?.closest('pre');
            const code = pre?.querySelector('code');
            if (button && code) {
              navigator.clipboard.writeText(code.innerText).then(() => {
                button.classList.add('copy-code-button--copied');
                button.addEventListener('animationend', () => {
                  button.classList.remove('copy-code-button--copied');
                }, { once: true });
              });
            }
          });
        `;

        doc.body.append(script);
      }

      return doc;
    }
  };
}
