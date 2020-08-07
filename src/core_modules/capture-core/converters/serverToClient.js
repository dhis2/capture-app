// @flow
import { moment } from 'capture-core-utils/moment';
import { parseNumber, parseTime } from 'capture-core-utils/parsers';
import elementTypes from '../metaData/DataElement/elementTypes';

function convertTime(d2Value: string) {
    const parseData = parseTime(d2Value);
    if (!parseData.isValid) {
        return null;
    }
    return parseData.momentTime;
}

const optionSetConvertersForType = {
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.NUMBER]: parseNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER]: parseNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_POSITIVE]: parseNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: parseNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_NEGATIVE]: parseNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.DATE]: (d2Value: string) => moment(d2Value, 'YYYY-MM-DD').toISOString(),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.DATETIME]: (d2Value: string) => moment(d2Value, 'YYYY-MM-DD HH:mm').toISOString(),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.TIME]: convertTime,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.TRUE_ONLY]: (d2Value: string) => ((d2Value === 'true') || null),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.BOOLEAN]: (d2Value: string) => (d2Value === 'true'),
    // [elementTypes.DURATION_MINUTES]: (d2Value: string) => parseDurationRepresentationtoMinutes(d2Value),
};

export function convertOptionSetValue(value: any, type: $Values<typeof elementTypes>) {
    if (value == null) {
        return null;
    }

    return optionSetConvertersForType[type] ? optionSetConvertersForType[type](value) : value;
}


const valueConvertersForType = {
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.NUMBER]: parseNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER]: parseNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_POSITIVE]: parseNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: parseNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_NEGATIVE]: parseNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.DATE]: (d2Value: string) => moment(d2Value, 'YYYY-MM-DD').toISOString(),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.DATETIME]: (d2Value: string) => moment(d2Value).toISOString(),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.TRUE_ONLY]: (d2Value: string) => ((d2Value === 'true') || null),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.BOOLEAN]: (d2Value: string) => (d2Value === 'true'),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.COORDINATE]: (d2Value: string) => {
        const arr = JSON.parse(d2Value);
        return { latitude: arr[1], longitude: arr[0] };
    },
};

export function convertValue(value: any, type: $Values<typeof elementTypes>) {
    if (value == null) {
        return null;
    }

    return valueConvertersForType[type] ? valueConvertersForType[type](value) : value;
}
