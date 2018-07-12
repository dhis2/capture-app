// @flow
import moment from '../utils/moment/momentResolver';
import elementTypes from '../metaData/DataElement/elementTypes';

import stringifyNumber from './common/stringifyNumber';

function convertDate(rawValue: string): string {
    const editedDate = rawValue;
    const momentDateLocal = moment(editedDate);
    return momentDateLocal.format('YYYY-MM-DD');
}

const valueConvertersForType = {
    [elementTypes.NUMBER]: stringifyNumber,
    [elementTypes.INTEGER]: stringifyNumber,
    [elementTypes.INTEGER_POSITIVE]: stringifyNumber,
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: stringifyNumber,
    [elementTypes.INTEGER_NEGATIVE]: stringifyNumber,
    [elementTypes.DATE]: convertDate,
    [elementTypes.TRUE_ONLY]: () => 'true',
    [elementTypes.BOOLEAN]: (rawValue: boolean) => (rawValue ? 'true' : 'false'),
    [elementTypes.FILE_RESOURCE]: (rawValue: Object) => rawValue.value,
};

export function convertValue(type: $Values<typeof elementTypes>, value: any) {
    if (!value && value !== 0 && value !== false) {
        return value;
    }
    return valueConvertersForType[type] ? valueConvertersForType[type](value) : value;
}
