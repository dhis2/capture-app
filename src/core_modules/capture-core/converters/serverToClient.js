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
    // $FlowFixMe[prop-missing] automated comment
    [dataElementTypes.NUMBER]: parseNumber,
    // $FlowFixMe[prop-missing] automated comment
    [dataElementTypes.INTEGER]: parseNumber,
    // $FlowFixMe[prop-missing] automated comment
    [dataElementTypes.INTEGER_POSITIVE]: parseNumber,
    // $FlowFixMe[prop-missing] automated comment
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: parseNumber,
    // $FlowFixMe[prop-missing] automated comment
    [dataElementTypes.INTEGER_NEGATIVE]: parseNumber,
    // $FlowFixMe[prop-missing] automated comment
    [dataElementTypes.DATE]: (d2Value: string) => moment(d2Value, 'YYYY-MM-DD').toISOString(),
    // $FlowFixMe[prop-missing] automated comment
    [dataElementTypes.DATETIME]: (d2Value: string) => moment(d2Value, 'YYYY-MM-DD HH:mm').toISOString(),
    // $FlowFixMe[prop-missing] automated comment
    [dataElementTypes.TIME]: convertTime,
    // $FlowFixMe[prop-missing] automated comment
    [dataElementTypes.TRUE_ONLY]: (d2Value: string) => ((d2Value === 'true') || null),
    // $FlowFixMe[prop-missing] automated comment
    [dataElementTypes.BOOLEAN]: (d2Value: string) => (d2Value === 'true'),
    // [dataElementTypes.DURATION_MINUTES]: (d2Value: string) => parseDurationRepresentationtoMinutes(d2Value),
};

export function convertOptionSetValue(value: any, type: $Values<typeof dataElementTypes>) {
    if (value == null) {
        return null;
    }

    // $FlowFixMe elementTypes flow error
    return optionSetConvertersForType[type] ? optionSetConvertersForType[type](value) : value;
}


const valueConvertersForType = {
    // $FlowFixMe[prop-missing] automated comment
    [dataElementTypes.NUMBER]: parseNumber,
    // $FlowFixMe[prop-missing] automated comment
    [dataElementTypes.INTEGER]: parseNumber,
    // $FlowFixMe[prop-missing] automated comment
    [dataElementTypes.INTEGER_POSITIVE]: parseNumber,
    // $FlowFixMe[prop-missing] automated comment
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: parseNumber,
    // $FlowFixMe[prop-missing] automated comment
    [dataElementTypes.INTEGER_NEGATIVE]: parseNumber,
    // $FlowFixMe[prop-missing] automated comment
    [dataElementTypes.DATE]: (d2Value: string) => moment(d2Value, 'YYYY-MM-DD').toISOString(),
    // $FlowFixMe[prop-missing] automated comment
    [dataElementTypes.DATETIME]: (d2Value: string) => moment(d2Value).toISOString(),
    // $FlowFixMe[prop-missing] automated comment
    [dataElementTypes.TRUE_ONLY]: (d2Value: string) => ((d2Value === 'true') || null),
    // $FlowFixMe[prop-missing] automated comment
    [dataElementTypes.BOOLEAN]: (d2Value: string) => (d2Value === 'true'),
    // $FlowFixMe[prop-missing] automated comment
    [dataElementTypes.COORDINATE]: (d2Value: string) => {
        const arr = JSON.parse(d2Value);
        return { latitude: arr[1], longitude: arr[0] };
    },
};

export function convertValue(value: any, type: $Values<typeof dataElementTypes>) {
    if (value == null) {
        return null;
    }

    // $FlowFixMe dataElementTypes flow error
    return valueConvertersForType[type] ? valueConvertersForType[type](value) : value;
}
