---
title: Helpers
description: Extend Doxicity's template engine with your own custom helpers.
---

# {{title}}

Helpers let you extend Handlebars with custom functionality. You can use them to manipulate data, generate content, and more. Every helper has a name and can be referenced in your pages using the following syntax. Doxicity ships with some built-in helpers, but you can also add your own.

## Usage

Helpers are accessed using the following syntax.

```hbs
\{{helperName}}
```

Some helpers accept one or more arguments. For example, the `{{uppercase}}` helper needs to know what string you're trying to transform. You can pass it an argument like this.

```hbs
\{{uppercase 'this will be uppercase'}}
```

If you want to pass [data](/config/data.html) instead of a hard-coded string, omit the quotes and pass the appropriate key.

```hbs
---
phrase: this will be uppercase
---

\{{uppercase phrase}}
```

Some helpers accept _hashes_, which are a lot like HTML attributes. Hashes can be provided in any order and can accept strings, numbers, and/or data.

```hbs
\{{helperName key='value' name='doxicity'}}
```

## Built-in Helpers

Doxicity ships with the following built-in helpers.

### asset

Joins the asset folder's path from your config with a custom path you provide. This helper should be used any time an asset file is referenced in your pages.

```hbs
\{{asset 'path/to/asset.jpg'}}

Outputs: /full/path/to/asset.jpg
```

### formatDate

Outputs a formatted date using the `Intl.DateTimeFormat` API. For now, please see the [helper's source code](https://github.com/claviska/doxicity/blob/main/src/helpers/format-date/format-date.ts) for all available arguments.

```hbs
\{{formatDate '2022-04-17' year='numeric' month='long' day='numeric'}}

Outputs: April 16, 2022
```

### formatNumber

Outputs a formatted number using the `Intl.NumberFormat` API. For now, please see the [helper's source code](https://github.com/claviska/doxicity/blob/main/src/helpers/format-number/format-number.ts) for all available arguments.

```hbs
\{{formatNumber 1000000}}

Outputs: 1,000,000
```

### formatUrl

Outputs a formatted URL. For now, please see the [helper's source code](https://github.com/claviska/doxicity/blob/main/src/helpers/format-url/format-url.ts) for all available arguments.

```hbs
\{{formatUrl 'https://example.com/file.ext?this=that' pathname=true}}

Outputs: example.com/file.ext
```

### theme

Joins the theme path with a custom path you provide. This helper should be used any time a theme file is referenced and is primarily used internally by the default theme.

```hbs
\{{theme 'path/to/file.ext'}}

Outputs: /full/path/to/file.ext
```

## Custom Helpers

You can register custom helpers in your config file using the `helpers` property.

```js
import myHelper from 'my-helper';

// doxicity.config.js
export default {
  // ...
  helpers: [myHelper]
};
```

### Writing Custom Own Helpers

Helpers must adhere to the `DoxicityHelper` interface described below. The interface is described in TypeScript, but you can write helpers in JavaScript as well.

```ts
export interface DoxicityHelper {
  name: string;
  callback: (args: unknown) => string;
}
```

Here's an example helper that converts a string to its uppercase equivalent.

```js
const myHelper = {
  name: 'uppercase',
  callback: string => string.touppercase()
};
```

Helpers can receive any valid argument(s) that Handlebars supports. You can find more details in the [Handlebars documentation](https://handlebarsjs.com/api-reference/helpers.html).
