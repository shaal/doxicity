---
title: Using Handlebars
description: Add logic and more to your docs using Handlebars.
---

# {{title}}

When working with [data](/config/data.html), you can use [Handlebars expressions](https://handlebarsjs.com/guide/expressions.html) to show values and add logic to your markdown files. This page will give you a quick intro to using Handlebars.

For the sake of brevity, only page data will be shown in these examples. However, remember that you can provide both [config data](/config/data.html#config-data) and [page data](/config/data.html#page-data) to your pages.

## Showing Data

Showing data is straight-forward. Wrap any property with two curly brackets as shown below.

```md
---
name: World
---

Hello, \{{name}}!
```

The published version of this page will say "Hello, World!".

### Nested Properties

Data can be complex. You may have nested properties that you want to access. This can be done by concatenating the names with a dot.

```md
---
user:
  firstName: Bob
  lastName: Marley
---

Hello, Mr. \{{user.lastName}}!
```

The published version of this page will say "Hello, Mr. Marley!".

## Conditionals

### if/else

You can conditionally render content using Handlebars' `\{{#if}}` expression.

```md
---
willShow: true
---

\{{#if willShow}}
  This will only show when true
\{{/if}}
```

If you want to provide fallback content when the expression is false, you can use the `\{{else}}` expression.

```md
---
willShow: true
---

\{{#if willShow}}
  This will only show when true
\{{else}}
  This will only show when false
\{{/if}}
```

### unless

Similarly, you can use `\{{#unless}}` to do the reverse.

```md
---
ready: false
---

\{{#unless ready}}
  This won't show until ready
\{{/unless}}
```

If you want to provide fallback content when the expression is false, you can use the `\{{else}}` expression.

```md
---
ready: false
---

\{{#unless ready}}
  This won't show until ready
\{{else}}
  This will show only when not ready
\{{/unless}}
```

## Loops

You can loop through objects and arrays using the `\{{#each}}` expression.

```md
---
items:
  - Item 1
  - Item 2
  - Item 3
---

\{{#each items}}
  \{{this}}<br>
\{{/each}}
```

The published version of this page will include an unordered list with all three items.

## Partials

You can include partials using the partial expression `\{{>partial}}`. First, [define a partial](/config/partials.html) by creating a file. Let's call this one `_quote.md`.

```md
> Some great quote that somebody said
```

Then include it in any page using this syntax.

```md
This is a quote

\{{>quote}}

Did you like it?
```

The published version of this page will say "This is a quote", followed by the included quote, and then "Did you like it?".
