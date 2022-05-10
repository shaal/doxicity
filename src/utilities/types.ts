export interface DoxicityConfig {
  /**
   * The name of the folder to copy assets to. This should not be a full path, only a folder name. Defaults to "assets".
   */
  assetFolderName: string;
  /** Deletes the outputDir before publishing. Defaults to false. */
  cleanOnPublish: boolean;
  /**
   * An array of files to copy to the published assets folder. Supports globs. All directories must be relative to your
   * project's root folder. If unset, Doxicity will look for a folder called "assets" in your root folder and copy it if
   * it exists.
   */
  copyAssets: string[];
  /** Global data to be passed to every page. */
  data: {
    meta?: {
      /** The default title of your documentation website. This will also be the default title when sharing. */
      title?: string;
      /**
       * The default description of your documentation website. This will also be the default description when sharing.
       */
      description?: string;
      /** The image to provide to OpenGraph clients. Used primarily when sharing links on third-party websites. */
      image?: string;
      /** The favicon to show in browsers and bookmarks. */
      favicon?: string;
      /** The logo to use in light mode. */
      logo?: string;
      /** Optional logo to use in dark mode. */
      logoDark?: string;
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
      /**
       * Determines if the sidebar should show. You can target individual pages by setting `meta.sidebar` to false in your
       * front matter. Default is true.
       */
      sidebar?: boolean;
      /** The Twitter username to provide when sharing on Twitter and supportive platforms. */
      twitterCreator?: string;
    };
    [key: string]: unknown;
  };
  /**
   * Set to true when working in dev mode. This prevents templates from being cached and makes publishing less
   * efficient, but it improves the developer experience.
   */
  dev: boolean;
  /**
   * Custom Handlebars helpers to register for use in templates.
   *
   * For more information, visit: https://handlebarsjs.com/guide/#custom-helpers
   */
  helpers: DoxicityHelper[];
  /** The source directory containing your markdown files. */
  inputDir: string;
  /** The directory to write processed files. */
  outputDir: string;
  /** Optional plugins that hook into the Doxicity API and gives you superpowers. */
  plugins: DoxicityPlugin[];
  /**
   * The name of the folder to copy theme files to. This should not be a full path, only a folder name. Defaults to
   * "theme".
   */
  themeFolderName: string;
  /** The base URL where your docs will be hosted, e.g. https://example.com/ */
  url?: string;
}

export interface DoxicityPage {
  pathname: string;
  inputFile: string;
  outputFile: string;
  data: Record<string, unknown>;
}

export interface DoxicityHelper {
  name: string;
  callback: (args: unknown) => string;
}

export interface DoxicityPlugin {
  /** Hooks into the DOM transform phase, allowing you to mutate the document before it gets turned into HTML. */
  transform?: (doc: Document, page: DoxicityPage, config: DoxicityConfig) => Document | Promise<Document>;

  /** Hooks into the raw HTML after all rendering and transformations are complete. */
  afterTransform?: (html: string, page: DoxicityPage, config: DoxicityConfig) => string | Promise<string>;

  /** Hooks into the pages after they've been rendered and after all transforms have completed. */
  afterAll?: (pages: DoxicityPage[], config: DoxicityConfig) => void | Promise<void>;
}
