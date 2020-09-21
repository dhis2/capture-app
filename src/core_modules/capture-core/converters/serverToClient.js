// @flow
import { moment } from 'capture-core-utils/moment';
import { parseNumber, parseTime } from 'capture-core-utils/parsers';
import { dataElementTypes } from '../metaData';

function convertTime(d2Value: string) {
    const parseData = parseTime(d2Value);
    if (!parseData.isValid) {
        return null;
    }
    return parseData.momentTime;
}

const optionSetConvertersForType = {
    [dataElementTypes.NUMBER]: parseNumber,
    [dataElementTypes.INTEGER]: parseNumber,
    [dataElementTypes.INTEGER_POSITIVE]: parseNumber,
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: parseNumber,
    [dataElementTypes.INTEGER_NEGATIVE]: parseNumber,
    [dataElementTypes.DATE]: (d2Value: string) => moment(d2Value, 'YYYY-MM-DD').toISOString(),
    [dataElementTypes.DATETIME]: (d2Value: string) => moment(d2Value, 'YYYY-MM-DD HH:mm').toISOString(),
    [dataElementTypes.TIME]: convertTime,
    [dataElementTypes.TRUE_ONLY]: (d2Value: string) => ((d2Value === 'true') || null),
    [dataElementTypes.BOOLEAN]: (d2Value: string) => (d2Value === 'true'),
};

export function convertOptionSetValue(value: any, type: DataElementTypes) {
    if (value == null) {
        return null;
    }

    // $FlowFixMe dataElementTypes flow error
    return optionSetConvertersForType[type] ? optionSetConvertersForType[type](value) : value;
}


const valueConvertersForType = {
    [dataElementTypes.NUMBER]: parseNumber,
    [dataElementTypes.INTEGER]: parseNumber,
    [dataElementTypes.INTEGER_POSITIVE]: parseNumber,
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: parseNumber,
    [dataElementTypes.INTEGER_NEGATIVE]: parseNumber,
    [dataElementTypes.DATE]: (d2Value: string) => moment(d2Value, 'YYYY-MM-DD').toISOString(),
    [dataElementTypes.DATETIME]: (d2Value: string) => moment(d2Value).toISOString(),
    [dataElementTypes.TRUE_ONLY]: (d2Value: string) => ((d2Value === 'true') || null),
    [dataElementTypes.BOOLEAN]: (d2Value: string) => (d2Value === 'true'),
    [dataElementTypes.COORDINATE]: (d2Value: string) => {
        const arr = JSON.parse(d2Value);
        return { latitude: arr[1], longitude: arr[0] };
    },
};

export function convertValue(value: any, type: DataElementTypes) {
    if (value == null) {
        return null;
    }

    // $FlowFixMe dataElementTypes flow error
    return valueConvertersForType[type] ? valueConvertersForType[type](value) : value;
}
