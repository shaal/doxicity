import type { DoxicityPage } from './types';

/** Thrown when an error in the configuration has been detected. */
export class ConfigError extends Error {}

/** Thrown when an error occurs during a clean operation. */
export class CleanError extends Error {}

/** Thrown when an error in an afterAll plugin plugin has been detected. */
export class AfterAllPluginError extends Error {
  pages: DoxicityPage[];

  constructor(pages: DoxicityPage[], message: string) {
    super();
    this.pages = pages;
    this.message = message;
  }
}

/** Thrown when an error in an afterTransform plugin has been detected. */
export class AfterTransformPluginError extends Error {
  page: DoxicityPage;

  constructor(page: DoxicityPage, message: string) {
    super();
    this.page = page;
    this.message = message;
  }
}

/** Thrown when a Handlebars template fails to render. */
export class TemplateRenderError extends Error {
  page: DoxicityPage;

  constructor(page: DoxicityPage, message: string) {
    super();
    this.page = page;
    this.message = message;
  }
}

/** Thrown when an error in a transform plugin has been detected. */
export class TransformPluginError extends Error {
  page: DoxicityPage;

  constructor(page: DoxicityPage, message: string) {
    super();
    this.page = page;
    this.message = message;
  }
}
