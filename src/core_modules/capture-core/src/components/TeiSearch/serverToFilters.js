// @flow
import DataElement from '../../metaData/DataElement/DataElement';
import elementTypes from '../../metaData/DataElement/elementTypes';

/*
import moment from '../../utils/moment/momentResolver';
import RenderFoundation from '../../metaData/RenderFoundation/RenderFoundation';
import stringifyNumber from '../../converters/common/stringifyNumber';

/*
function convertDate(rawValue: string): string {
    const editedDate = rawValue;
    const momentDateLocal = moment(editedDate);
    return momentDateLocal.format('YYYY-MM-DD');
}
*/

type RangeValue = {
    from: number,
    to: number,
}

const equals = (value: any, elementId: string) => `${elementId}:eq:${value}`;
const like = (value: any, elementId: string) => `${elementId}:like:${value}`;

/*
const greaterThan = (value: any, elementId: string) => `${elementId}:gt:${value}`;

const lessThan = (value: any, elementId: string) => `${elementId}:lt:${value}`;
*/

function convertRange(value: RangeValue, elementId: string) {
    return `${elementId}:ge:${value.from}:le:${value.to}`;
}

const valueConvertersForType = {
    [elementTypes.TEXT]: like,
    [elementTypes.NUMBER_RANGE]: convertRange,
};

export function convertValue(type: $Values<typeof elementTypes>, value: any, metaElement: DataElement) {
    if (!value && value !== 0 && value !== false) {
        return value;
    }
    return valueConvertersForType[type] ? valueConvertersForType[type](value, metaElement.id) : equals(value, metaElement.id);
}
