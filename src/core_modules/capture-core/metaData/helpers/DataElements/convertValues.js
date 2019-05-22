// @flow
import log from 'loglevel';
import isArray from 'd2-utilizr/src/isArray';
import isObject from 'd2-utilizr/src/isObject';
import { DataElement } from '../../DataElement';
import errorCreator from '../../../utils/errorCreator';
import type { ConvertFn } from '../../DataElement/DataElement';

export type ValuesType = { [key: string]: any };

const errorMessages = {
    CONVERT_VALUES_STRUCTURE: 'Values can not be converted, data is neither an array or an object',
};

function getElementsById(dataElements: Array<DataElement>) {
    // $FlowFixMe
    return dataElements.toHashMap('id');
}

function convertObjectValues(values: ValuesType, elementsById: { [id: string]: DataElement }, onConvert: ConvertFn) {
    return Object.keys(values).reduce((inProgressValues, id) => {
        const metaElement = elementsById[id];
        const rawValue = values[id];
        const convertedValue = metaElement ? metaElement.convertValue(rawValue, onConvert) : rawValue;
        return { ...inProgressValues, [id]: convertedValue };
    }, {});
}

function convertArrayValues(
    arrayOfValues: Array<ValuesType>,
    elementsById: { [id: string]: DataElement },
    onConvert: ConvertFn,
) {
    // $FlowSuppress
    return arrayOfValues.map((values: ValuesType) => this.convertObjectValues(values, elementsById, onConvert));
}

export default function convertValues<T: ?ValuesType | Array<ValuesType>>(
    values: T,
    dataElements: Array<DataElement>,
    onConvert: ConvertFn,
): T {
    if (values) {
        const elementsById = getElementsById(dataElements);
        if (isArray(values)) {
            // $FlowSuppress
            return convertArrayValues(values, elementsById, onConvert);
        } else if (isObject(values)) {
            // $FlowSuppress
            return convertObjectValues(values, elementsById, onConvert);
        }

        log.error(errorCreator(errorMessages.CONVERT_VALUES_STRUCTURE)({ values }));
    }
    return values;
}
