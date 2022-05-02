import { randomUUID } from 'crypto';
import { createSlug } from '../../utilities/slug.js';
import type { DoxicityPlugin } from 'src/utilities/types';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface TableOfContentsOptions {
  /** A CSS selector that points to one or more elements where the table of contents will be added. */
  target: string;
  /** The heading level to start collecting entries from. Defaults to "h2". */
  startLevel: HeadingLevel;
  /** The heading level to stop collecting entries from. Defaults to "h4". */
  endLevel: HeadingLevel;
  /** A CSS selector that points to an element that contains the headings to add. Defaults to "body". */
  within: string;
}

function getHeadingLevel(level: HeadingLevel) {
  return parseInt(level.slice(1));
}

function makeListItem(doc: Document, heading: HTMLHeadingElement): HTMLLIElement {
  const hasId = heading.hasAttribute('id');
  const hasChildWithId = heading.querySelector('[id]');
  const label = heading.textContent ?? '';
  let id;

  // Determine the target id
  if (hasId) id = heading.getAttribute('id');
  if (hasChildWithId) id = heading.querySelector('[id]')?.getAttribute('id');
  if (!id) {
    id = createSlug(label);
    if (!id) id = randomUUID().slice(-12);
    heading.setAttribute('id', id);
  }

  // Generate the list item
  const li = doc.createElement('li');
  const a = doc.createElement('a');
  a.setAttribute('href', `#${id}`);
  a.textContent = label;
  li.append(a);

  return li;
}

function makeNav(doc: Document, headings: HTMLHeadingElement[], container: Element, level: number) {
  let heading;
  do {
    heading = headings.shift();
  } while (heading && !/^h[123456]$/i.test(heading.tagName));

  if (heading) {
    const currentLevel = getHeadingLevel(heading.tagName as HeadingLevel);
    let count = 0;
    let li;

    if (currentLevel < level) {
      // Move one level up
      do {
        container = container.parentNode!.parentNode as Element;
        count--;
      } while (count > currentLevel - level);
    } else if (currentLevel > level) {
      // Move one level down
      do {
        li = container.lastChild;
        if (li === null) li = container.appendChild(makeListItem(doc, heading));
        container = li.appendChild(doc.createElement('ul'));
        count++;
      } while (count < currentLevel - level);
    }

    li = container.appendChild(makeListItem(doc, heading));
    makeNav(doc, headings, container, level + count);
  }
}

/** Generates a table of contents from headings on the page. */
export default function (options: Partial<TableOfContentsOptions>): DoxicityPlugin {
  const opts: TableOfContentsOptions = {
    target: '.table-of-contents',
    startLevel: 'h2',
    endLevel: 'h4',
    within: 'body',
    ...options
  };

  return {
    transform: doc => {
      const within = opts.within ? doc.querySelector(opts.within) : doc.body;
      const startLevel = getHeadingLevel(opts.startLevel);
      const endLevel = getHeadingLevel(opts.endLevel);
      const levelsToInclude = [1, 2, 3, 4, 5, 6].slice(startLevel - 1, endLevel);
      const headingSelector = levelsToInclude.map(level => `h${level}`).join(',');

      // Nothing to parse
      if (!within) return doc;

      // Generate the <nav> element
      const headings = [...within.querySelectorAll(headingSelector)] as HTMLHeadingElement[];
      const nav = doc.createElement('nav');
      makeNav(doc, headings, nav, startLevel);

      // Add the table of contents to the target container(s), but only if nav items exist
      if (nav.children.length > 0) {
        [...doc.querySelectorAll(opts.target)].forEach((container: Element) => {
          container.innerHTML = nav.outerHTML;
        });
      }

      return doc;
    }
  };
}
