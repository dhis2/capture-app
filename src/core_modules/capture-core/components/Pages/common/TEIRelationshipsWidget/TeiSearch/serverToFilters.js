import { dataElementTypes } from '../../../../../metaData';
import { escapeString } from '../../../../../utils/escapeString';

const equals = (value, elementId) => `${elementId}:eq:${escapeString(value)}`;
const like = (value, elementId) => `${elementId}:like:${escapeString(value)}`;


function convertRange(value, elementId) {
    return `${elementId}:ge:${escapeString(String(value.from))}:le:${escapeString(String(value.to))}`;
}

const valueConvertersForType = {
    [dataElementTypes.TEXT]: like,
    [dataElementTypes.NUMBER_RANGE]: convertRange,
    [dataElementTypes.DATE_RANGE]: convertRange,
    [dataElementTypes.DATETIME_RANGE]: convertRange,
    [dataElementTypes.TIME_RANGE]: convertRange,
};

export function convertValue(value, type, metaElement) {
    if (!value && value !== 0 && value !== false) {
        return value;
    }
    return valueConvertersForType[type] ? valueConvertersForType[type](value, metaElement.id) : equals(value, metaElement.id);
}

export function convertValueToEqual(value, type, metaElement) {
    if (!value && value !== 0 && value !== false) {
        return value;
    }
    return equals(value, metaElement.id);
}
