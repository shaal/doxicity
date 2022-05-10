---
title: Theming
description: Doxicity ships with a default theme that you can customize.
---

# {{title}}

Doxicity ships with a default theme that's intentionally abstracted so you don't have to mess with complex layouts and templating logic. By design, custom themes aren't supported by _replacing_ the existing template, but instead by _mutating_ it with one or more plugins.

The default theme supports light and dark mode out of the box, using a curated palette of colors that inverts the color scale in dark mode. This means you get light and dark more for free! And if you use the theme tokens correctly, the same will be true for any customizations you make.

## Adjusting the Theme

Doxicity ships with a number of curated color palettes, which makes it easy to switch the primary/accent color with a single [config file](/config/) option.

```js
export default {
  // ...
  primaryColor: 'blue'
}
```

Available colors are described on the [configuration page](/config/#all-configuration-options). It's also possible to create your own palettes, but that is much more involved and discouraged for most users.

## Theme Tokens

Sorry, but building all this open source stuff is a lot of work! 😅 If you're reading this, you're one of Doxicity's earliest users. Apologies for any bugs, rough edges, or missing docs — such as this section!

I will continue to improve these docs as the project evolves, but for now please refer to the following sections of the project's source code for a complete list of theme tokens that Doxicity provides. Many are self-explanatory, but if anything is unclear, feel free to reach out on the discussion forum.

- [Theme tokens](https://github.com/claviska/doxicity/blob/main/theme/css/docs.css)
- [Light mode color palettes](https://github.com/claviska/doxicity/blob/main/theme/css/light.css)
- [Dark mode color palettes](https://github.com/claviska/doxicity/blob/main/theme/css/dark.css)

:::tip
Are you interested in contributing to Doxicity? Help me build out this website better! Get in touch either through [GitHub](https://github.com/claviska/doxicity/discussions) or [Twitter](https://twitter.com/claviska) (my DMs are open).
:::
