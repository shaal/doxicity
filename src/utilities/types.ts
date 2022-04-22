export interface DoxicityConfig {
  /**
   * The name of the folder to copy assets to. This should not be a full path, only a folder name. Defaults to "assets".
   */
  assetFolderName: string;
  /** Cleans the outputDir before publishing. Defaults to true. */
  cleanOnPublish: boolean;
  /**
   * An array of files to copy to the published assets folder. Supports globs. All directories must be relative to your
   * project's root folder. If unset, Doxicity will look for a folder called "assets" in your root folder and copy it if
   * it exists.
   */
  copyAssets: string[];
  /** Global data to be passed to every page. */
  data: {
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
  /**
   * Custom Handlebars partials to register for use in templates.
   *
   * For more information, visit: https://handlebarsjs.com/guide/#partials
   */
  partials: DoxicityPartial[];
  /** Optional plugins that hook into the Doxicity API and gives you superpowers. */
  plugins: DoxicityPlugin[];
  /** The directory of the theme to use. Assets in this directory will be copied to the resulting assets directory. */
  themeDir: string;
  /**
   * The name of the folder to publish your theme to. This should not be a full path, only a folder name. Defaults to
   * "theme".
   */
  themeFolderName: string;
}

export interface DoxicityPage {
  inputFile: string;
  outputFile: string;
  data: Record<string, unknown>;
}

export interface DoxicityHelper {
  name: string;
  callback: (args: unknown) => string;
}

export interface DoxicityPartial {
  name: string;
  template: string;
}

export interface DoxicityPlugin {
  /** Hooks into the DOM transform phase, allowing you to mutate the document before it gets turned into HTML. */
  transform?: (doc: Document, page: DoxicityPage, config: DoxicityConfig) => Document | Promise<Document>;

  /** Hooks into the raw HTML after all rendering and transformations are complete. */
  afterTransform?: (html: string, page: DoxicityPage, config: DoxicityConfig) => string | Promise<string>;

  /** Hooks into the pages after they've been rendered and after all transforms have completed. */
  afterAll?: (pages: DoxicityPage[], config: DoxicityConfig) => void | Promise<void>;
}
