interface FormatNumberArgs {
  /** The locale to use when formatting the number. */
  lang: string;
  /** The formatting style to use. */
  type: 'currency' | 'decimal' | 'percent';
  /** Turns off grouping separators. */
  noGrouping: boolean;
  /** The currency to use when formatting. Must be an ISO 4217 currency code such as `USD` or `EUR`. */
  currency: string;
  /** How to display the currency. */
  currencyDisplay: 'symbol' | 'narrowSymbol' | 'code' | 'name';
  /** The minimum number of integer digits to use. Possible values are 1 - 21. */
  minimumIntegerDigits: number;
  /** The minimum number of fraction digits to use. Possible values are 0 - 20. */
  minimumFractionDigits: number;
  /** The maximum number of fraction digits to use. Possible values are 0 - 20. */
  maximumFractionDigits: number;
  /** The minimum number of significant digits to use. Possible values are 1 - 21. */
  minimumSignificantDigits: number;
  /** The maximum number of significant digits to use,. Possible values are 1 - 21. */
  maximumSignificantDigits: number;
}

/**
 * Formats a number using the Intl.DateTimeFormat API. Available arguments are described on this page:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/format
 *
 * @example
 *
 * {{ formatNumber 1000000 }}
 */
export default {
  name: 'formatNumber',
  callback: (num: number | string, options: Handlebars.HelperOptions) => {
    const args = (options?.hash ?? {}) as FormatNumberArgs;
    const numberToFormat = parseFloat(String(num));
    return new Intl.NumberFormat(args.lang ?? 'en', args).format(numberToFormat);
  }
};
