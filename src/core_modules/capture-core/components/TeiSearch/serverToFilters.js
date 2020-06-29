// @flow
import DataElement from '../../metaData/DataElement/DataElement';
import elementTypes from '../../metaData/DataElement/elementTypes';

type RangeValue = {
    from: number,
    to: number,
}

const equals = (value: any, elementId: string) => `${elementId}:eq:${value}`;
const like = (value: any, elementId: string) => `${elementId}:like:${value}`;


function convertRange(value: RangeValue, elementId: string) {
    return `${elementId}:ge:${value.from}:le:${value.to}`;
}

// todo report (lgmt)
const valueConvertersForType = {
    [elementTypes.TEXT]: like,
    [elementTypes.NUMBER_RANGE]: convertRange,
    [elementTypes.DATE_RANGE]: convertRange,
    [elementTypes.DATETIME_RANGE]: convertRange,
    [elementTypes.TIME_RANGE]: convertRange,
};

export function convertValue(value: any, type: $Values<typeof elementTypes>, metaElement: DataElement) {
    if (!value && value !== 0 && value !== false) {
        return value;
    }
    return valueConvertersForType[type] ? valueConvertersForType[type](value, metaElement.id) : equals(value, metaElement.id);
}

export function convertValueToEqual(value: any, type: $Values<typeof elementTypes>, metaElement: DataElement) {
    if (!value && value !== 0 && value !== false) {
        return value;
    }
    return equals(value, metaElement.id);
}
