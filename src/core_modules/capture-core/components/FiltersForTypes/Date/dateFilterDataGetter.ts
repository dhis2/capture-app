import { parseNumber } from 'capture-core-utils/parsers';
import { mainOptionKeys } from './options';
import { dateFilterTypes } from './constants';
import { convertLocalToIsoCalendar } from '../../../utils/converters/date';
import {
    isEmptyValueFilter,
    getEmptyValueFilterData,
} from '../EmptyValue';
import type { AbsoluteDateFilterData, RelativeDateFilterData, DateFilterData, DateValue } from './types';

type Value = {
    main: string;
    from?: DateValue | null;
    to?: DateValue | null;
    start?: string | null;
    end?: string | null;
};

function convertAbsoluteDate(fromValue?: string | null, toValue?: string | null) {
    const rangeData: AbsoluteDateFilterData = {
        type: dateFilterTypes.ABSOLUTE,
    };

    if (fromValue) {
        const fromClientValue: string = convertLocalToIsoCalendar(fromValue);
        rangeData.ge = fromClientValue;
    }

    if (toValue) {
        const toClientValue: string = convertLocalToIsoCalendar(toValue);
        rangeData.le = toClientValue;
    }

    return rangeData;
}

function convertRelativeRange(value: Value) {
    const rangeData: RelativeDateFilterData = {
        type: dateFilterTypes.RELATIVE,
    };
    const startBuffer = value.start ? parseNumber(value.start) : 0;
    const endBuffer = value.end ? parseNumber(value.end) : 0;

    if (startBuffer != null) {
        rangeData.startBuffer = -Math.abs(startBuffer);
    }

    if (endBuffer != null) {
        rangeData.endBuffer = endBuffer;
    }

    return rangeData;
}

function convertSelections(value: Value) {
    if (value.main === mainOptionKeys.ABSOLUTE_RANGE) {
        return convertAbsoluteDate(value?.from?.value, value?.to?.value);
    }
    if (value.main === mainOptionKeys.RELATIVE_RANGE) {
        return convertRelativeRange(value);
    }
    return { type: dateFilterTypes.RELATIVE, period: value.main };
}

export function getDateFilterData(value: Value | string): DateFilterData | null {
    if (typeof value === 'string' && isEmptyValueFilter(value)) {
        return getEmptyValueFilterData(value);
    }

    if (typeof value === 'string' || value == null) {
        return null;
    }

    return convertSelections(value);
}
