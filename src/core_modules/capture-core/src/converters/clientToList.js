// @flow
import elementTypes from '../metaData/DataElement/elementTypes';
import DataElement from '../metaData/DataElement/DataElement';

import { displayTypes, displayDate, displayDateTime } from '../utils/date/date.utils';
import stringifyNumber from './common/stringifyNumber';

function convertDataForListDisplay(rawValue: string): string {
    return displayDate(rawValue, displayTypes.SHORT);
}

function convertDateTimeForListDisplay(rawValue: string): string {
    return displayDateTime(rawValue, displayTypes.SHORT);
}

const valueConvertersForType = {
    [elementTypes.NUMBER]: stringifyNumber,
    [elementTypes.INTEGER]: stringifyNumber,
    [elementTypes.INTEGER_POSITIVE]: stringifyNumber,
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: stringifyNumber,
    [elementTypes.INTEGER_NEGATIVE]: stringifyNumber,
    [elementTypes.DATE]: convertDataForListDisplay,
    [elementTypes.DATETIME]: convertDateTimeForListDisplay,
    [elementTypes.TRUE_ONLY]: () => 'Yes',
    [elementTypes.BOOLEAN]: (rawValue: boolean) => (rawValue ? 'Yes' : 'No'),
};

export function convertValue(type: $Values<typeof elementTypes>, value: any, dataElement: DataElement) {
    if (!value && value !== 0 && value !== false) {
        return value;
    }

    if (dataElement.optionSet) {
        return dataElement.optionSet.getOptionText(value);
    }

    return valueConvertersForType[type] ? valueConvertersForType[type](value) : value;
}
