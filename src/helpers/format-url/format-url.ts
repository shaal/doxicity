import { URL } from 'url'; // in Browser, the URL in native accessible on window

interface FormatUrlArgs {
  /** Outputs the protocol, e.g. https:// */
  protocol: boolean;
  /** Outputs the hostname (true by default). */
  hostname: boolean;
  /** Outputs the path. */
  pathname: boolean;
  /** Outputs the query (search) string, e.g. ?page=2 */
  search: boolean;
  /** Outputs the hash, e.g. #hash (default false). */
  hash: boolean;
}

/**
 * Formats a URL into a more readable syntax. By default, this helper will only show the hostname, but you can specify
 * additional URL parts to show as desired.
 *
 * @example
 *
 * {{ formatUrl 'https://example.com/file.ext?this=that' pathname=true }}
 */
export default {
  name: 'formatUrl',
  callback: (url: string, options: Handlebars.HelperOptions) => {
    const args: FormatUrlArgs = {
      protocol: false,
      hostname: true,
      pathname: false,
      search: false,
      hash: false,
      ...(options?.hash as Partial<FormatUrlArgs>)
    };
    let output = '';

    try {
      const parsedUrl = new URL(url);
      if (args.protocol) output += `${parsedUrl.protocol}//`;
      if (args.hostname) output += parsedUrl.hostname;
      if (args.pathname) output += parsedUrl.pathname;
      if (args.search) output += parsedUrl.search;
      if (args.hash) output += parsedUrl.hash;
    } catch {
      throw new Error(`Invalid URL passed to the formatUrl helper: "${url}"`);
    }

    return output;
  }
};
