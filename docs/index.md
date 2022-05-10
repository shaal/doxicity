---
title: Welcome to Doxicity
description: Write amazing docs. Fast, free, and flexible.
---

{{>splash}}

# Meet Doxicity

Everyone loves good documentation, but few actually enjoy creating it. Unfortunately, documentation is often one of the last things to land in a project. Sometimes, it's neglected entirely.

Doxicity removes the friction of creating a documentation website by allowing you to focus on the stuff that matters — content! Using markdown, you can create pages that turn into a robust, accessible documentation website with a single command.

1. Write markdown ✏️
2. Add config data, front matter, plugins, and/or expressions ✨
3. Run `npx doxicity` and publish your new docs 📗

Doxicity ships with an elegant theme that includes light/dark mode, multiple theme colors, and printer-friendly styles out of the box. Most of its functionality comes from plugins, which are fun to write but incredibly powerful.

## Try It

The fastest way to try Doxicity is by running the following commands in your terminal. Installation isn't required, but you'll need to have [Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) on your machine.

```bash
echo '# Welcome to Doxicity' > index.md
npx doxicity --serve
```

This will create a single markdown filed called `index.md` and publish it to `_docs/index.html`. It will then launch a development server so you can preview your work as you edit. Go ahead and make some changes to `index.md` and watch the browser instantly update. ✨

If this is your first time using Doxicity, please [check out the quick start](/quick-start.html) to see everything you can do!

:::warning
Doxicity is very young and still in an experimental beta phase. There may be breaking changes now and then as the project evolves. All updates, including instructions for upgrading, will be listed [in the changelog](/resources/changelog.html).
:::

## Notable Features

- Write pages in markdown
- Use custom markdown syntaxes for callouts, asides, details, and more
- Add site-level data (via config) and page-level data (via front matter)
- Use Handlebars expressions in your markdown (interpolation, conditionals, loops, helpers, and more)
- Create declarative partials for easily reusing blocks of content
- Elegant default theme with light/dark mode and over a dozen accent colors
- First-party plugins for search, code highlighting, and more
- Simple plugin API that supports standard DOM manipulation
- Generates lightweight, static HTML pages with minimal runtime dependencies
- Built-in dev server
