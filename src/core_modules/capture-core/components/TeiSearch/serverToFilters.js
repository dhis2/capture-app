// @flow
import { type DataElement, dataElementTypes } from '../../metaData';

type RangeValue = {
    from: number,
    to: number,
}

const equals = (value: any, elementId: string) => `${elementId}:eq:${value}`;
const like = (value: any, elementId: string) => `${elementId}:like:${value}`;


function convertRange(value: RangeValue, elementId: string) {
    return `${elementId}:ge:${value.from}:le:${value.to}`;
}

const valueConvertersForType = {
    [dataElementTypes.TEXT]: like,
    [dataElementTypes.NUMBER_RANGE]: convertRange,
    [dataElementTypes.DATE_RANGE]: convertRange,
    [dataElementTypes.DATETIME_RANGE]: convertRange,
    [dataElementTypes.TIME_RANGE]: convertRange,
};

export function convertValue(value: any, type: DataElementTypes, metaElement: DataElement) {
    if (!value && value !== 0 && value !== false) {
        return value;
    }
    // $FlowFixMe dataElementTypes flow error
    return valueConvertersForType[type] ? valueConvertersForType[type](value, metaElement.id) : equals(value, metaElement.id);
}

export function convertValueToEqual(value: any, type: DataElementTypes, metaElement: DataElement) {
    if (!value && value !== 0 && value !== false) {
        return value;
    }
    return equals(value, metaElement.id);
}
