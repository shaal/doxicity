import {
  camelCase,
  capitalCase,
  constantCase,
  dotCase,
  headerCase,
  noCase,
  paramCase,
  pascalCase,
  pathCase,
  sentenceCase,
  snakeCase
} from 'change-case';
import Handlebars from 'handlebars';

export function registerStringHelpers() {
  Handlebars.registerHelper('camelCase', camelCase);
  Handlebars.registerHelper('capitalCase', capitalCase);
  Handlebars.registerHelper('constantCase', constantCase);
  Handlebars.registerHelper('dotCase', dotCase);
  Handlebars.registerHelper('headerCase', headerCase);
  Handlebars.registerHelper('noCase', noCase);
  Handlebars.registerHelper('paramCase', paramCase);
  Handlebars.registerHelper('pascalCase', pascalCase);
  Handlebars.registerHelper('pathCase', pathCase);
  Handlebars.registerHelper('sentenceCase', sentenceCase);
  Handlebars.registerHelper('snakeCase', snakeCase);
  Handlebars.registerHelper('lowerCase', String.prototype.toLowerCase);
  Handlebars.registerHelper('upperCase', String.prototype.toUpperCase);
  Handlebars.registerHelper('encodeURI', encodeURI);
  Handlebars.registerHelper('encodeURIComponent', encodeURIComponent);
}
