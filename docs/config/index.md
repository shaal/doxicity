---
title: Configuration
---

# {{title}}

A config file lets you customize assets, data, plugins, and every other aspect of how Doxicity works. Configuration is optional, but strongly recommended to take full advantage of Doxicity's features.

## Sample Config

You can configure your Doxicity site by adding a file called `doxicity.config.js` to your project's root directory. Doxicity expects your config file to be an ES Module. You can use this template as a starting point.

```js
// doxicity.config.js
export default {
  assetFolderName: 'assets',
  cleanOnPublish: true,
  copyAssets: ['assets/**/*'],
  data: {},
  dev: true,
  helpers: [],
  inputDir: '.',
  outputDir: '_docs',
  plugins: [],
  themeFolderName: 'theme'
};
```

## All Configuration Options

The following options are available in your config.

| Name              | Type               | Description                                                                                                                                                                                                                                       |
| ----------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `assetFolderName` | `string`           | The name of the folder to copy assets to. This should not be a full path, only a folder name. Defaults to "assets".                                                                                                                               |
| `cleanOnPublish`  | `boolean`          | Cleans the outputDir before publishing. Defaults to true.                                                                                                                                                                                         |
| `copyAssets`      | `string[]`         | An array of files to copy to the published assets folder. Supports globs. All directories must be relative to your project's root folder. If unset, Doxicity will look for a folder called "assets" in your root folder and copy it if it exists. |
| `data`            | `object`           | Global "config data" to be passed to every page.
| `dev`             | `boolean`          | Set to true when working in dev mode. This prevents templates from being cached and makes publishing less efficient, but it improves the developer experience.                                                                                    |
| `helpers`         | `DoxicityHelper[]` | Custom Handlebars helpers to register for use in templates.                                                                                                                                                                                       |
| `inputDir`        | `string`           | The source directory containing your markdown files.                                                                                                                                                                                              |
| `outputDir`       | `string`           | The directory to write processed files.                                                                                                                                                                                                           |
| `plugins`         | `DoxicityPlugin[]` | Optional plugins that hook into the Doxicity API and gives you superpowers.                                                                                                                                                                       |
| `themeFolderName` | `string`           | The name of the folder to publish your theme to. This should not be a full path, only a folder name. Defaults to "theme".                                                                                                                         |
