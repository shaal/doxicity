import type { DoxicityPlugin } from 'src/utilities/types';

interface TableScrollOptions {
  /** The class name to apply to the wrapper. Defaults to "table-scroll". */
  className: string;
  /** The inline styles to apply to the wrapper. */
  styles: Partial<CSSStyleDeclaration>;
  /** A CSS selector that points to an element that contains the tables to process. Defaults to "main". */
  within: string;
}

/** Adds a <div class="table-wrapper"> element around tables so when they overflow you can make them scroll. */
export default function (options: Partial<TableScrollOptions>): DoxicityPlugin {
  const opts: TableScrollOptions = {
    className: 'table-scroll',
    styles: {
      maxWidth: '100%',
      overflowX: 'auto'
    },
    within: 'main',
    ...options
  };

  return {
    transform: doc => {
      const tables = [...doc.querySelectorAll('table')];
      tables.forEach(table => {
        const div = doc.createElement('div');
        div.classList.add(opts.className);

        Object.keys(opts.styles ?? {}).forEach(property => {
          /* @ts-expect-error - setting styles */
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          div.style[property] = opts.styles[property];
        });

        table.insertAdjacentElement('beforebegin', div);
        div.append(table);
      });
      return doc;
    }
  };
}
