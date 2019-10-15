// @flow
import moment from '../utils/moment/momentResolver';
import { parseNumber, parseTime } from '../utils/parsers';
import elementTypes from '../metaData/DataElement/elementTypes';

function convertTime(d2Value: string) {
    const parseData = parseTime(d2Value);
    if (!parseData.isValid) {
        return null;
    }
    return parseData.momentTime;
}

const optionSetConvertersForType = {
    [elementTypes.NUMBER]: parseNumber,
    [elementTypes.INTEGER]: parseNumber,
    [elementTypes.INTEGER_POSITIVE]: parseNumber,
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: parseNumber,
    [elementTypes.INTEGER_NEGATIVE]: parseNumber,
    [elementTypes.DATE]: (d2Value: string) => moment(d2Value, 'YYYY-MM-DD').toISOString(),
    [elementTypes.DATETIME]: (d2Value: string) => moment(d2Value, 'YYYY-MM-DD HH:mm').toISOString(),
    [elementTypes.TIME]: convertTime,
    [elementTypes.TRUE_ONLY]: (d2Value: string) => ((d2Value === 'true') || null),
    [elementTypes.BOOLEAN]: (d2Value: string) => (d2Value === 'true'),
    // [elementTypes.DURATION_MINUTES]: (d2Value: string) => parseDurationRepresentationtoMinutes(d2Value),
};

export function convertOptionSetValue(type: $Values<typeof elementTypes>, value: any) {
    if (value == null) {
        return null;
    }

    return optionSetConvertersForType[type] ? optionSetConvertersForType[type](value) : value;
}


const valueConvertersForType = {
    [elementTypes.NUMBER]: parseNumber,
    [elementTypes.INTEGER]: parseNumber,
    [elementTypes.INTEGER_POSITIVE]: parseNumber,
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: parseNumber,
    [elementTypes.INTEGER_NEGATIVE]: parseNumber,
    [elementTypes.DATE]: (d2Value: string) => moment(d2Value, 'YYYY-MM-DD').toISOString(),
    [elementTypes.DATETIME]: (d2Value: string) => moment(d2Value).toISOString(),
    [elementTypes.TRUE_ONLY]: (d2Value: string) => ((d2Value === 'true') || null),
    [elementTypes.BOOLEAN]: (d2Value: string) => (d2Value === 'true'),
    [elementTypes.COORDINATE]: (d2Value: string) => {
        const arr = JSON.parse(d2Value);
        return { latitude: arr[1], longitude: arr[0] };
    },
};

export function convertValue(type: $Values<typeof elementTypes>, value: any) {
    if (value == null) {
        return null;
    }

    return valueConvertersForType[type] ? valueConvertersForType[type](value) : value;
}
