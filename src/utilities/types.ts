export interface DoxicityConfig {
  /** The source directory containing your markdown files. */
  inputDir: string;
  /** The directory to write processed files. */
  outputDir: string;
  /** A custom directory to look for templates in. If no template is found, the built-in templates will be used. */
  templateDir: string;
  /** Global data to be passed to every page. */
  data: {
    [key: string]: unknown;
  };
  /** Optional plugins that hook into the Doxicity API and gives you superpowers. */
  plugins: DoxicityPlugin[];
}

export interface DoxicityPlugin {
  /** Hooks into the DOM transform phase, allowing you to mutate the document before it get's turned into HTML. */
  transform?: (doc: Document) => Document;

  /** Hooks into the rendered HTML after all rendering and transformations are complete. */
  afterTransform?: (html: string) => string;
}
