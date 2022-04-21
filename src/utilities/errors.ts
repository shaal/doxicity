/** Thrown when an error in the configuration has been detected. */
export class ConfigError extends Error {}

/** Thrown when a Handlebars template fails to render. */
export class TemplateRenderError extends Error {}

/** Thrown when a template fails to resolve. */
export class TemplateResolveError extends Error {}
