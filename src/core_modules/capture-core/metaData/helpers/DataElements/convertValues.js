// @flow
import log from 'loglevel';
import isArray from 'd2-utilizr/lib/isArray';
import isObject from 'd2-utilizr/lib/isObject';
import { errorCreator } from 'capture-core-utils';
import { dataElementTypes, type DataElement } from '../../DataElement';
import type { ConvertFn } from '../../DataElement/DataElement';

export type ValuesType = { [key: string]: any };

const errorMessages = {
    CONVERT_VALUES_STRUCTURE: 'Values can not be converted, data is neither an array or an object',
};

function getElementsById(dataElements: Array<DataElement>) {
    // $FlowFixMe
    return dataElements.toHashMap('id');
}

function convertObjectValues(
    values: ValuesType,
    elementsById: { [id: string]: DataElement },
    onConvert: ConvertFn,
) {
    return Object.entries(values).reduce(
        (acc, [id, rawValue]) => {
            const element = elementsById[id];
            if (!element) {
                acc[id] = rawValue;
                return acc;
            }
            const clientValue = element?.convertValue(rawValue, onConvert);

            if (element.optionSet) {
                if (element.type === dataElementTypes.MULTI_TEXT) {
                    acc[id] = element.optionSet?.getMultiOptionsText(clientValue);
                } else {
                    acc[id] = element.optionSet?.getOptionText(clientValue);
                }
            } else {
                acc[id] = clientValue;
            }
            return acc;
        },
        {},
    );
}

function convertArrayValues(
    arrayOfValues: Array<ValuesType>,
    elementsById: { [id: string]: DataElement },
    onConvert: ConvertFn,
) {
    // $FlowFixMe[prop-missing] automated comment
    return arrayOfValues.map((values: ValuesType) => this.convertObjectValues(values, elementsById, onConvert));
}

export function convertValues<T: ?ValuesType | Array<ValuesType>>(
    values: T,
    dataElements: Array<DataElement>,
    onConvert: ConvertFn,
): T {
    if (values) {
        const elementsById = getElementsById(dataElements);
        if (isArray(values)) {
            // $FlowFixMe[incompatible-return] automated comment
            // $FlowFixMe[incompatible-call] automated comment
            return convertArrayValues(values, elementsById, onConvert);
        } else if (isObject(values)) {
            // $FlowFixMe[incompatible-return] automated comment
            // $FlowFixMe[incompatible-call] automated comment
            return convertObjectValues(values, elementsById, onConvert);
        }

        log.error(errorCreator(errorMessages.CONVERT_VALUES_STRUCTURE)({ values }));
    }
    return values;
}
