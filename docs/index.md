---
title: Welcome to Doxicity
description: Write amazing docs. Fast, free, and flexible.
---

# {{title}}

_{{description}}_

Doxicity is a <abbr title="Command Line Interface">CLI</abbr> that turns a directory of [markdown](https://en.wikipedia.org/wiki/Markdown) files into a robust, accessible documentation website. You can configure it, add plugins, and use Handlebars expressions to do amazing things.

1. Write markdown ✏️
2. Optionally add config data, front matter, plugins, and/or expressions ✨
3. Run `npx doxicity` and publish your new docs 📗

Doxicity ships with an elegant theme that includes light/dark mode, multiple theme colors, and printer-friendly styles out of the box. Most of its functionality comes from plugins, which are fun to write but incredibly powerful.

This project is designed and built in New Hampshire by [Cory LaViska](https://twitter.com/claviska).

## Try It

The fastest way to get started with Doxicity is by running the following commands in your terminal. Installation isn't required, but you'll need to have [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed.

```bash
echo '# Welcome to Doxicity' > index.md
npx doxicity --serve
```

This will create a single markdown filed called `index.md` and publish it to `_docs/index.html`. It will then launch a development server so you can preview your work as you edit. Go ahead and make some changes to `index.md` and watch the browser instantly update. ✨

Be sure to [check out the quick start](/quick-start.html) if this is your first time using Doxicity.

## Notable Features

- Write pages in markdown
- Additional markdown syntaxes for callouts, asides, details, and more
- Supports site-level data (via config) and page-level data (via front matter)
- Use Handlebars expressions in markdown files (interpolation, conditionals, loops, helpers, and more)
- Declarative partials for easily reusing blocks of content
- Elegant default theme with light/dark mode and over a dozen accent colors
- First-party plugins for search, code highlighting, and more
- Simple plugin API for creating your own plugins
- Built-in dev server
