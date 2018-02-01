// @flow
import moment from 'moment';

export default function parseDate(dateString: string) {
    let [year, month, day] = dateString.split('-');
    day = parseInt(day.match(/^[0-9]+/)[0]);
    const date = moment({ y: year, M: month - 1, d: day }).toDate();
    return date;
}
