import moment from 'moment';

/**
 * Converts a server timestamp (e.g. createdAt) to an ISO string in UTC
 * @export
 * @param {string} value - timestamp string
 * @returns {string | null}
 */
export function convertTimestamp(value?: string | null): string | null {
    if (value == null) {
        return null;
    }

    return moment(value).toISOString();
}
