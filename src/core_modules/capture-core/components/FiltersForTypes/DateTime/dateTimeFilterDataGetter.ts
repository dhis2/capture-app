import { formatMomentEn } from 'capture-core-utils/date';
import { parseTime } from 'capture-core-utils/parsers';
import { convertLocalToIsoDate } from '../../../utils/converters/date';
import {
    isEmptyValueFilter,
    getEmptyValueFilterData,
} from '../EmptyValue';
import { dateFilterTypes } from '../Date/date.const';
import type {
    DateTimeFilter,
    DateTimeFilterData,
    DateTimeValue,
    Value,
} from './dateTime.types';

function buildIsoDateTime(dateTimeValue: DateTimeValue, defaultTime: string): string | null {
    if (!dateTimeValue.date || dateTimeValue.isValid === false) {
        return null;
    }
    const isoDate = convertLocalToIsoDate(dateTimeValue.date);
    const parsedTime = parseTime(dateTimeValue.time || defaultTime);
    if (!isoDate || !parsedTime.isValid) {
        return null;
    }
    return `${isoDate}T${formatMomentEn(parsedTime.momentTime, 'HH:mm:ss.SSS')}`;
}

export function getDateTimeFilterData(value: Value): DateTimeFilter | null {
    if (!value) return null;
    if (isEmptyValueFilter(value)) return getEmptyValueFilterData(value);
    const filterData: DateTimeFilterData = { type: dateFilterTypes.ABSOLUTE };

    if (value.from?.date) {
        const ge = buildIsoDateTime(value.from, '00:00');
        if (ge) {
            filterData.ge = ge;
        }
    }

    if (value.to?.date) {
        const le = buildIsoDateTime(value.to, '23:59');
        if (le) {
            filterData.le = le;
        }
    }

    if (!filterData.ge && !filterData.le) {
        return null;
    }

    return filterData;
}
