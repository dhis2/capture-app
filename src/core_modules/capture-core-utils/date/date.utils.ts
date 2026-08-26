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
