import moment from 'moment';

/**
 * Formats a moment instance using English (Western-Arabic) numerals,
 * regardless of the currently active moment locale.
 *
 * Use this anywhere the output is treated as data — API payloads, query
 * parameters, object keys, values parsed back into dates, or otherwise
 * compared as strings — because locale-dependent numerals (e.g. Arabic's
 * ٠١٢٣) break those consumers.
 *
 * @param momentDate the moment instance to format
 * @param format the moment format string (defaults to 'YYYY-MM-DD')
 * @returns the formatted string with Western-Arabic numerals
 */
export function formatMomentEn(
    input: moment.MomentInput,
    format = 'YYYY-MM-DD',
) {
    return moment(input).locale('en').format(format);
}

/**
 * Transliterates Western-Arabic digits (0-9) in a string to the digit glyphs
 * of the currently active moment locale (e.g. ٠١٢٣ for Arabic).
 *
 * Use this only on the display path, after a value has been formatted for
 * rendering to the user. Never apply it to values that will be parsed,
 * compared, sent to the API, or otherwise treated as data.
 *
 * @param input a string that may contain Western-Arabic digits
 * @returns the same string with digits rendered in the active locale
 */
export function localizeDigits(input: string): string {
    return moment.localeData().postformat(input);
}
