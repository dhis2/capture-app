// @flow
import moment from '../../utils/moment/momentResolver';
import DataElement from '../../metaData/DataElement/DataElement';
import elementTypes from '../../metaData/DataElement/elementTypes';
import RenderFoundation from '../../metaData/RenderFoundation/RenderFoundation';

import stringifyNumber from '../../converters/common/stringifyNumber';

function convertDate(rawValue: string): string {
    const editedDate = rawValue;
    const momentDateLocal = moment(editedDate);
    return momentDateLocal.format('YYYY-MM-DD');
}

const equals = (value: any, elementId: string) => `${elementId}:eq:${value}`;
const like = (value: any, elementId: string) => `${elementId}:like:${value}`;
const greaterThan = (value: any, elementId: string) => `${elementId}:gt:${value}`;
const lessThan = (value: any, elementId: string) => `${elementId}:lt:${value}`;

const valueConvertersForType = {
    [elementTypes.TEXT]: like,
};

export function convertValue(type: $Values<typeof elementTypes>, value: any, metaElement: DataElement) {
    if (!value && value !== 0 && value !== false) {
        return value;
    }
    return valueConvertersForType[type] ? valueConvertersForType[type](value, metaElement.id) : equals(value, metaElement.id);
}
