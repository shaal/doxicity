---
title: Partials
---

# {{title}}

Partials are independent chunks of content that can be included in any template or page. They can be authored with a combination of markdown, HTML, and/or Handlebars expressions. Partials cannot have their own front matter, but they do have access to [config data](/config/data.html#config-data) and [page data](/config/data.html#page-data). You can also pass data to them as hash arguments.

## Declarative Partials

Partials are defined declaratively. To add a partial, create a file in your project that begins with an underscore. For example, a file named `_mypartial.md` will result in a partial called `mypartial` that can be included like this:

```hbs
\{{> mypartial}}
```

Similarly, a partial located at `folder/_mypartial.md` will be available as `folder/mypartial`:

```hbs
\{{> folder/mypartial}}
```

:::tip
Partial names map to their file location, minus the underscore and file extension.
:::

## Passing Data to Partials

When including a partial, you can pass data in the form of hash arguments. Hash arguments look similar to HTML attributes.

```hbs
\{{>avatar name="Doxicity" image="https://example.com/image.jpg"}}
```

Aside from the usual config data and page data, this will also expose `name` and `image` to the partial.

To learn more about how partials work, refer to the [Handlebars documentation](https://handlebarsjs.com/guide/partials.html#partials).