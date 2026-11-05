import { convertToIso8601, formatCalendarDate } from '@dhis2/multi-calendar-dates';
import { systemSettingsStore } from '../../../metaDataMemoryStores';
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

function localCalendarDateToIsoDate(localDate: string): string | null {
    try {
        const calendar = systemSettingsStore.get().calendar;
        return formatCalendarDate(convertToIso8601(localDate, calendar as any));
    } catch {
        return null;
    }
}

function buildIsoDateTime(dateTimeValue: DateTimeValue, defaultTime: string): string | null {
    if (!dateTimeValue.date || dateTimeValue.isValid === false) {
        return null;
    }
    const isoDate = localCalendarDateToIsoDate(dateTimeValue.date);
    if (!isoDate) {
        return null;
    }
    const time = dateTimeValue.time || defaultTime;
    return `${isoDate}T${time}:00`;
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
