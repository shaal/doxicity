interface FormatDateArgs {
  /** The locale to use when formatting the date/time. */
  lang: string;
  /** The format for displaying the weekday. */
  weekday: 'narrow' | 'short' | 'long';
  /** The format for displaying the era. */
  era: 'narrow' | 'short' | 'long';
  /** The format for displaying the year. */
  year: 'numeric' | '2-digit';
  /** The format for displaying the month. */
  month: 'numeric' | '2-digit' | 'narrow' | 'short' | 'long';
  /** The format for displaying the day. */
  day: 'numeric' | '2-digit';
  /** The format for displaying the hour. */
  hour: 'numeric' | '2-digit';
  /** The format for displaying the minute. */
  minute: 'numeric' | '2-digit';
  /** The format for displaying the second. */
  second: 'numeric' | '2-digit';
  /** The format for displaying the time. */
  timeZoneName: 'short' | 'long';
  /** The time zone to express the time in. */
  timeZone: string;
  /** When set, 24 hour time will always be used. */
  hourFormat: 'auto' | '12' | '24';
}

/**
 * Formats a date using the Intl.DateTimeFormat API. Available arguments are described on this page:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 *
 * @example
 *
 * {{ formatDate '2022-04-17' year='numeric' month='long' day='numeric' }}
 */
export default {
  name: 'formatDate',
  callback: (date: string | Date, options: Handlebars.HelperOptions) => {
    const args = (options?.hash ?? {}) as Partial<FormatDateArgs>;
    const dateToFormat = new Date(date);
    return new Intl.DateTimeFormat(args.lang ?? 'en', args).format(dateToFormat);
  }
};
