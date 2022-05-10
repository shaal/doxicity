---
title: Authoring
description: How to author pages in markdown using Doxicity.
---

# {{title}}

Everyone loves good documentation, but few actually enjoy creating it. Unfortunately, documentation is often one of the last things to land in a project. Sometimes, it's neglected entirely.

Doxicity removes the friction of creating a documentation website by allowing you to focus on the stuff that matters — content! Using markdown, you can create pages that turn into a robust, accessible documentation website with a single command.

If you're new to markdown, this page will bring you up to speed with what you need to know to get started.

## Intro to Markdown

Markdown is a markup syntax that turns text into HTML. It's a convenient way to go from `[this](this.html)` to `<a href="this.html">this<a>` without having to type all those quotes and brackets. It's built to be as simple as possible — most users can pick up the basics in just a few minutes.

Doxicity mostly adheres to the [CommonMark spec](https://commonmark.org/), but there are a few additional syntaxes that are really helpful when writing docs.

### Markdown Cheat Sheet

The following table includes a non-exhaustive list of CommonMark syntaxes that are supported. You can expect these to work in Doxicity and most places markdown is supported.

| Feature         | Markdown                                                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Heading         | <pre>\# H1<br>\#\# H2<br>\#\#\# H3</pre>                                                                                       |
| Bold            | <pre>\*\*bold text\*\*</pre>                                                                                                   |
| Italic          | <pre>\*italicized text\*</pre>                                                                                                 |
| Blockquote      | <pre>\> This is a blockquote</pre>                                                                                             |
| Ordered List    | <pre>1. Item 1<br>2. Item 2<br>3. Item 3</pre>                                                                                 |
| Unordered List  | <pre>- Item 1<br>- Item 2<br>- Item 3</pre>                                                                                    |
| Code (inline)   | <pre>\`inline code\`</pre>                                                                                                     |
| Code (block)    | <pre>\`\`\`<br>code block<br>\`\`\`</pre>                                                                                      |
| Horizontal Rule | <pre>---</pre>                                                                                                                 |
| Link            | <pre>\[link text\](https://example.com/)</pre>                                                                                 |
| Image           | <pre>\!\[alt text\](image.jpg)</pre>                                                                                           |
| Table           | <pre>\| Syntax \| Description \|<br>\| ----------- \| ----------- \|<br>\| Header \| Title \|<br>\| Paragraph \| Text \|</pre> |

### Doxicity-flavored Markdown

The following table includes additional Doxicity-specific markdown syntaxes. You should only expect these to work with Doxicity.

| Feature         | Markdown                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------- |
| Highlight       | <pre>\=\=mark\=\=</pre>                                                                           |
| Insert          | <pre>\+\+insert\+\+</pre>                                                                         |
| Delete/strike   | <pre>\~\~delete\~\~</pre>                                                                         |
| Tip callout     | <pre>:::tip<br>This is a tip!<br>:::</pre>                                                        |
| Warning callout | <pre>:::warning<br>This is a warning!<br>:::</pre>                                                |
| Danger callout  | <pre>:::danger<br>This is something dangerous!<br>:::</pre>                                       |
| Aside           | <pre>:::aside<br>This will be rendered on the side<br>:::</pre>                                   |
| Details         | <pre>:::details Toggle Me<br>This content is expandable<br>:::</pre>                              |
| Cover           | <pre>:::cover<br>This is a cover section that will expand the full width of the page<br>:::</pre> |
