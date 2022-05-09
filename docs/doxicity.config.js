import { formatDateHelper, formatNumberHelper, formatUrlHelper } from '../dist/helpers.js';
import {
  activeLinksPlugin,
  anchorHeadingsPlugin,
  beautifyPlugin,
  copyCodePlugin,
  customTitlePlugin,
  externalLinksPlugin,
  highlightCodePlugin,
  iconAddonPlugin,
  searchPlugin,
  smoothLinksPlugin,
  tableOfContentsPlugin,
  tableScrollPlugin,
  typographyPlugin
} from '../dist/plugins.js';

export default {
  inputDir: '.',
  outputDir: '_website',
  cleanOnPublish: true,
  helpers: [formatDateHelper, formatNumberHelper, formatUrlHelper],
  copyAssets: ['assets/**/*'],
  dev: true,
  plugins: [
    activeLinksPlugin(),
    anchorHeadingsPlugin({ levels: ['h2', 'h3', 'h4', 'h5', 'h6'] }),
    externalLinksPlugin({ target: '_blank', noopener: false, noreferrer: false }),
    copyCodePlugin(),
    iconAddonPlugin({
      // TODO add className for targeting
      url: 'https://github.com/claviska/doxicity',
      target: '_blank',
      icon: 'github'
    }),
    iconAddonPlugin({
      url: 'https://twitter.com/doxicityApp',
      target: '_blank',
      icon: 'twitter',
      insert: 'append'
    }),
    highlightCodePlugin(),
    tableOfContentsPlugin({
      target: '.table-of-contents',
      startLevel: 'h2',
      endLevel: 'h2'
    }),
    tableScrollPlugin(),
    typographyPlugin(),
    smoothLinksPlugin(),
    searchPlugin(),
    customTitlePlugin({
      suffix: ' &middot; Doxicity',
      skip: page => page.inputFile === 'index.md'
    }),
    beautifyPlugin({ indent_size: 2, indent_char: ' ' })
  ],
  data: {
    meta: {
      title: 'Hello, world!',
      description: 'This is a description of your docs site.'
    }
  }
};
