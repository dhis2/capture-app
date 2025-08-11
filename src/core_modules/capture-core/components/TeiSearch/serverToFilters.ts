import type { DataElement } from '../../metaData';
import { dataElementTypes } from '../../metaData';
import { escapeString } from '../../utils/escapeString';

type RangeValue = {
    from: number;
    to: number;
};

const equals = (value: any, elementId: string) => `${elementId}:eq:${escapeString(value)}`;
const like = (value: any, elementId: string) => `${elementId}:like:${escapeString(value)}`;

const convertRange = (value: RangeValue, { id: elementId }: DataElement) => (
    `${elementId}:ge:${escapeString(String(value.from))}:le:${escapeString(String(value.to))}`
);

const convertString = (value: any, metaElement: DataElement) => {
    const hasOptionSet = metaElement.optionSet && metaElement.type !== dataElementTypes.MULTI_TEXT;
    return hasOptionSet ? equals(value, metaElement.id) : like(value, metaElement.id);
};

const valueConvertersForType = {
    [dataElementTypes.TEXT]: convertString,
    [dataElementTypes.MULTI_TEXT]: convertString,
    [dataElementTypes.NUMBER_RANGE]: convertRange,
    [dataElementTypes.INTEGER_RANGE]: convertRange,
    [dataElementTypes.INTEGER_POSITIVE_RANGE]: convertRange,
    [dataElementTypes.INTEGER_NEGATIVE_RANGE]: convertRange,
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE_RANGE]: convertRange,
    [dataElementTypes.DATE_RANGE]: convertRange,
    [dataElementTypes.DATETIME_RANGE]: convertRange,
    [dataElementTypes.TIME_RANGE]: convertRange,
};

export function convertValue(value: any, type: typeof dataElementTypes, metaElement: DataElement) {
    if (!value && value !== 0 && value !== false) {
        return value;
    }
    return valueConvertersForType[type] ? valueConvertersForType[type](value, metaElement) : equals(value, metaElement.id);
}

export function convertValueToEqual(value: any, type: typeof dataElementTypes, metaElement: DataElement) {
    if (!value && value !== 0 && value !== false) {
        return value;
    }
    return equals(value, metaElement.id);
}
