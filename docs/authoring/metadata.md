---
title: Metadata
description: Configure your docs by providing metadata.
---

# {{title}}

The following metadata properties are available to customize through [config data](/config/data.html#config-data) or [page data](/config/data.html#page-data). Remember that data cascades, so it's best to set default in your config and override titles, description, and other properties at the page level.

| Name             | Type      | Description                                                                                                                                      |
|------------------|-----------|------------------------------------------------------------------------------------------------------------------------------------------------- | 
| `title`          | `string`  | The default title of your documentation website. This will also be the default title when sharing.                                               |
| `description`    | `string`  | The default description of your documentation website. This will also be the default description when sharing.                                   |
| `image`          | `string`  | The image to provide to OpenGraph clients. Used primarily when sharing links on third-party websites.                                            |
| `favicon`        | `string`  | The favicon to show in browsers and bookmarks.                                                                                                   |
| `logo`           | `string`  | The logo to use in light mode.                                                                                                                   |
| `logoDark`       | `string`  | Optional logo to use in dark mode.                                                                                                               |
| `primaryColor`   | `'gray' \| 'red' \| 'orange' \| 'amber' \| 'yellow' \| 'lime' \| 'green' \| 'emerald' \| 'teal' \| 'cyan' \| 'sky' \| 'blue' \| 'indigo' \| 'violet' \| 'purple' \| 'fuchsia' \| 'pink' \| 'rose'` | Sets the theme's access color. Defaults to `green`. |
| `sidebar`        | `boolean` | Determines if the sidebar should show. You can target individual pages by setting `meta.sidebar` to false in your front matter. Default is true. |
| `twitterCreator` | `string`  | The Twitter username to provide when sharing on Twitter and supportive platforms.                                                                |

To provide metadata in your config file:

```js
// doxicity.config.js
export default {
  // ...
  data: {
    meta: {
      title: 'My Doxicity Project',
      description: 'Just another docs website.',
      image: 'https://example.com/path/to/image.jpg'
    }
  }
};
```

To provide metadata in a page's front matter:

```md
---
title: Page Title
description: Page Description
meta:
  title: Meta title for OpenGraph here
  description: Meta description for OpenGraph here
  image: /path/to/image.jpg
---
```

## Sharing

Doxicity generates basic OpenGraph and Twitter Card properties out of the box. However, you must do a few things for this to work optimally.

1. Set a `url` in your config (OpenGraph requires fully-qualified URLs)
2. Set `meta.title`, `meta.description`, and optionally `meta.image` in your config data. These will serve as the "default" title and description for all pages.
3. Set `meta.title`, `meta.description`, and/or `meta.image` on any page you want to have custom share data.
