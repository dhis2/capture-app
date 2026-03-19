import { convertToIso8601 } from '@dhis2/multi-calendar-dates';
import { padWithZeros } from 'capture-core-utils/date';
import { systemSettingsStore } from '../../../metaDataMemoryStores';
import type { DateTimeFilterData, DateTimeValue } from './types/dateTime.types';
import type { Value } from './DateTime.types';

function localCalendarDateToIsoDate(localDate: string): string | null {
    try {
        const calendar = systemSettingsStore.get().calendar;
        const { year, month, day } = convertToIso8601(localDate, calendar as any);
        return `${padWithZeros(year, 4)}-${padWithZeros(month, 2)}-${padWithZeros(day, 2)}`;
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
    const localStr = `${isoDate}T${time}:00`;
    return new Date(localStr).toISOString();
}

export function getDateTimeFilterData(value: NonNullable<Value>): DateTimeFilterData | null {
    const filterData: DateTimeFilterData = { type: 'ABSOLUTE' };

    if (value.from?.date) {
        const ge = buildIsoDateTime(value.from, '00:00');
        if (ge) {
            filterData.ge = ge;
        }
    }

    if (value.to?.date) {
        const le = buildIsoDateTime(value.to, '00:00');
        if (le) {
            filterData.le = le;
        }
    }

    if (!filterData.ge && !filterData.le) {
        return null;
    }

    return filterData;
}
