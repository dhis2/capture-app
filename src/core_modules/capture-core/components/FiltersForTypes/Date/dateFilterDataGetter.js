// @flow
import { mainOptionKeys } from './mainOptions';
import { parseDate } from '../../../utils/converters/date';
import { type AbsoluteDateFilterData, dateFilterTypes } from '../filters.types';

type Value = {
    main: string,
    from?: ?string,
    to?: ?string,
}

function convertAbsoluteDate(fromValue: ?string, toValue: ?string) {
    const rangeData: AbsoluteDateFilterData = {
        type: dateFilterTypes.ABSOLUTE,
    };

    if (fromValue) {
        // $FlowFixMe[incompatible-type] automated comment
        const fromClientValue: string = parseDate(fromValue).momentDate;
        rangeData.ge = fromClientValue;
    }

    if (toValue) {
        // $FlowFixMe[incompatible-type] automated comment
        const toClientValue: string = parseDate(toValue).momentDate;
        rangeData.le = toClientValue;
    }

    return rangeData;
}

function convertSelections(value: Value) {
    return value.main === mainOptionKeys.CUSTOM_RANGE ?
        convertAbsoluteDate(value.from, value.to) :
        { type: dateFilterTypes.RELATIVE, period: value.main };
}

export function getDateFilterData(value: Value) {
    return convertSelections(value);
}
