---
title: Metadata
---

# {{title}}

TODO

```ts
meta?: {
  /** The logo to use in light mode. */
  logo?: string;
  /** Optional logo to use in dark mode. */
  logoDark?: string;
  /**
   * By default, this will be set to the current page's URL. You can override it if you want to provide a different
   * URL for sharing.
   */
  url?: string;
  /** The default title of your documentation website, primarily used for sharing. */
  title?: string;
  /** The default description of your documentation website, primarily used for sharing. */
  description?: string;
  /** The image to provide to OpenGraph clients. Used primarily when sharing links on third-party websites. */
  image?: string;
  /** The favicon to show in browsers and bookmarks. */
  favicon?: string;
  /** 
   * Determines if the sidebar should show. You can target individual pages by setting `meta.sidebar` to false in your 
   * front matter. Default is true.
   */
  sidebar?: boolean;
  /** Sets the theme's access color. Defaults to green. */
  primaryColor?:
    | 'gray'
    | 'red'
    | 'orange'
    | 'amber'
    | 'yellow'
    | 'lime'
    | 'green'
    | 'emerald'
    | 'teal'
    | 'cyan'
    | 'sky'
    | 'blue'
    | 'indigo'
    | 'violet'
    | 'purple'
    | 'fuchsia'
    | 'pink'
    | 'rose';
  /** The Twitter username to provide when sharing on Twitter and supportive platforms. */
  twitterCreator?: string;
};
```

## Sharing