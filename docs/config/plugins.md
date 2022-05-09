---
title: Plugins
---

# {{title}}

Plugins are used to extend Doxicity's functionality. For your convenience, a number of useful first-party plugins come out of the box. You can enable as many or as few as you'd like.

## Activating Plugins

Plugins are imported and activated in your [config file](/config/).

Example:

```js
// doxicity.config.js
import myPlugin from 'my-doxicity-plugin';

export default {
  // ...
  plugins: [
    myPlugin({
      /* options here */
    })
  ]
};
```

Plugins will be executed in the same order they appear in the `plugins` array.

## First-party Plugins

The following plugins ship with the official Doxicity package. Additional third-party plugins can be found on [npm](https://www.npmjs.com/).

- `activeLinks`: Adds a custom class name to active links on the page.
- `anchorHeadings`: Turns headings into deep-linkable anchors with unique ids.
- `beautify`: Runs the resulting HTML through JS Beautify to improve formatting and indentation.
- `copyCode`: Adds a button to each code field that copies the code when clicked.
- `externalLinks`: Makes external links safe by adding `rel="noopener noreferrer"` and optionally opens them in a new window.
- `githubCorner`: Adds a GitHub badge that links to your repo to the top-right corner of your site.
- `highlightCode`: Highlights code fields using Prism. All languages that Prism supports work by default. Highlighting is done at build time, so no JavaScript is shipped to the client.
- `search`: (IN PROGRESS) Generates a Lunr search index and adds a search UI to your site.
- `smartQuotes`: Applies smart quotes to your content automatically.
- `smoothLink`: Makes in-page links scroll smoothly instead of jumping.
- `tableOfContents`: A customizable plugin that generates a table of contents. You can select which headings are selected and where the TOC gets rendered.
- `tableScroll`: Adds a wrapper around table elements, allowing them to scroll horizontally on smaller screens.

Example usage:

```js
// doxicity.config.js
import { activeLinks, anchorHeadings, highlightCode, search } from 'doxicity/plugins';

export default {
  // ...
  plugins: [activeLinks(), anchorHeadings(), highlightCode(), search()]
};
```

## Writing Your Own Plugins

Many static site generators offer a ton of hooks for plugin authors to tap into. However, this usually results in confusion and unintended results. For example, how does each hook affect rendering? What if a plugin runs too soon or too late? What if it only applies to markdown content and not the rest of the HTML? With so many hooks, it's difficult to keep track of which plugins are doing what and when.

Doxicity simplies this by offering only a limited number of hooks and making it easy to mutate the entire page — not just the markdown content. At the heart of Doxicity's plugin API is the `transform` hook. It provides you with a `Document` object that you can mutate just like you would in a browser.

Here's a contrived example that prepends the text "Wow " to every paragraph of every page.

```js
const wowPlugin = {
  transform: doc => {
    doc.querySelectorAll('p').forEach(p => {
      p.innerHTML = 'Wow ' + p.innerHTML;
    });
  }
};

export default wowPlugin;
```

This may seem silly, but the important thing to note is that you have complete control over every page. You can change the template's structure, add or remove things from the DOM, mutate existing elements, and more.

:::tip
A good starting point for aspiring plugin authors is to look at [Doxicity's plugins folder](https://github.com/claviska/doxicity/tree/main/src/plugins) to see how some of the built-in plugins work.
:::

### Plugin Hooks

The following hooks are currently available to plugin authors.

| Name              | Description                                                                                                                                                           |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `transform`       | Hooks into the DOM transform phase, allowing you to mutate the document object before it gets turned into HTML. Use this for all types of DOM manipulation.           |
| `afterTransform ` | Hooks into the raw HTML string after all rendering and transformations are complete. Use this for formatters.                                                         |
| `afterAll`        | Hooks into the pages after they've been rendered and after all transforms have completed. Use this when you need to do something after all pages have been processed. |

Every Doxicity plugin must adhere to the `DoxicityPlugin` interface. The interface is described in TypeScript, but you can write plugins in JavaScript as well. All hooks can be synchronous or asynchronous.

```ts
export interface DoxicityPlugin {
  transform?: (doc: Document, page: DoxicityPage, config: DoxicityConfig) => Document | Promise<Document>;
  afterTransform?: (html: string, page: DoxicityPage, config: DoxicityConfig) => string | Promise<string>;
  afterAll?: (pages: DoxicityPage[], config: DoxicityConfig) => void | Promise<void>;
}
```
