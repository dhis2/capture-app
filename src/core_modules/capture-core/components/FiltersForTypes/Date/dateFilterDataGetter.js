// @flow
import { parseNumber } from 'capture-core-utils/parsers';
import { mainOptionKeys } from './options';
import { dateFilterTypes } from './constants';
import { convertLocalToIsoCalendar } from '../../../utils/converters/date';
import { type AbsoluteDateFilterData, type RelativeDateFilterData, type DateValue } from './types';

type Value = {
    main: string,
    from?: ?DateValue,
    to?: ?DateValue,
    start?: ?string,
    end?: ?string,
};

function convertAbsoluteDate(fromValue: ?string, toValue: ?string) {
    const rangeData: AbsoluteDateFilterData = {
        type: dateFilterTypes.ABSOLUTE,
    };

    if (fromValue) {
        // $FlowFixMe[incompatible-type] automated comment
        const fromClientValue: string = convertLocalToIsoCalendar(fromValue);
        rangeData.ge = fromClientValue;
    }

    if (toValue) {
        // $FlowFixMe[incompatible-type] automated comment
        const toClientValue: string = convertLocalToIsoCalendar(toValue);
        rangeData.le = toClientValue;
    }

    return rangeData;
}

function convertRelativeRange(value: Value) {
    const rangeData: RelativeDateFilterData = {
        type: dateFilterTypes.RELATIVE,
    };
    const startBuffer = value.start && parseNumber(value.start);
    const endBuffer = value.end && parseNumber(value.end);

    if (startBuffer || startBuffer === 0) {
        rangeData.startBuffer = -Math.abs(startBuffer);
    }

    if (endBuffer || endBuffer === 0) {
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

export function getDateFilterData(value: Value) {
    return convertSelections(value);
}
