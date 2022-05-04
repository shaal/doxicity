/**
 * A block helper that uses the first truthy value in its arguments. If no value is truthy, nothing is rendered unless
 * an {{else}} block is provided.
 *
 * @example
 *
 * {{#use '' 'boom'}}
 *   {{this}} {{! outputs "boom" }}
 * {{/use}}
 *
 * {{#use '' ''}}
 *   {{this}}
 * {{else}}
 *   No value
 * {{/use}}
 */
export function use(...args: unknown[]): string {
  const argsToTest = args.slice(0, -1);
  const context = args.slice(-1)[0] as Handlebars.HelperOptions;

  for (const arg of argsToTest) {
    if (arg) {
      return context.fn(arg);
    }
  }

  return context.inverse('');
}
