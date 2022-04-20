export interface DoxicityConfig {
  /** The source directory containing your markdown files. */
  inputDir: string;
  /** The directory to write processed files. */
  outputDir: string;
  /** A custom directory to look for templates in. If no template is found, the built-in templates will be used. */
  templateDir: string;
  /** The name of your assets folder. Defaults to "assets". */
  assetDirName: string;
  /**
   * An array of files to copy to the published assets folder. Supports globs. All directories must be relative to your
   * project's root folder. If unset, Doxicity will look for a folder called "assets" in your root folder and copy it if
   * it exists.
   */
  copyFiles: string[];
  /** Global data to be passed to every page. */
  data: {
    [key: string]: unknown;
  };
  /**
   * Custom Handlebars helpers to register for use in templates.
   *
   * For more information, visit: https://handlebarsjs.com/guide/#custom-helpers
   */
  helpers: DoxicityHelper[];
  /**
   * Custom Handlebars partials to register for use in templates.
   *
   * For more information, visit: https://handlebarsjs.com/guide/#partials
   */
  partials: DoxicityPartial[];
  /** Optional plugins that hook into the Doxicity API and gives you superpowers. */
  plugins: DoxicityPlugin[];
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
