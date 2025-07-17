import { convertValue } from '../../../converters/clientToForm';
import type { RenderFoundation } from '../../../metaData';
import { DataElement } from '../../../metaData';
import { getValidationError } from '../dataEntryField/internal/dataEntryField.utils';

export type DataEntryPropToInclude = any;

export function getDataEntryMeta(dataEntryPropsToInclude: Array<DataEntryPropToInclude>) {
    return dataEntryPropsToInclude
        .reduce((accMeta, propToInclude) => {
            let propMeta;
            if (propToInclude.type) {
                propMeta = { type: propToInclude.type };
            } else if (propToInclude.onConvertOut) {
                propMeta = {
                    onConvertOut: propToInclude.onConvertOut.toString(),
                    clientId: propToInclude.clientId,
                    featureType: propToInclude.featureType,
                };
            } else {
                propMeta = {};
            }

            propMeta.clientIgnore = propToInclude.clientIgnore;

            const key = propToInclude.id || propToInclude.dataEntryId || Object.keys(propToInclude)[0];

            accMeta[key] = propMeta;
            return accMeta;
        }, {});
}

export function getDataEntryValues(
    dataEntryPropsToInclude: Array<DataEntryPropToInclude>,
    clientValuesForDataEntry: any,
) {
    const standardValuesArray = dataEntryPropsToInclude
        .filter(propToInclude => propToInclude.type && propToInclude.id)
        .map(propToInclude => new DataElement((o) => {
            o.id = propToInclude.id;
            o.type = propToInclude.type;
        }))
        .map(dataElement => ({
            id: dataElement.id,
            value: dataElement.convertValue(clientValuesForDataEntry[dataElement.id], convertValue),
        }));

    const specialValuesArray = dataEntryPropsToInclude
        .filter(propToInclude => propToInclude.onConvertIn && propToInclude.dataEntryId)
        .map(propToInclude => ({
            id: propToInclude.dataEntryId,
            value: propToInclude.onConvertIn(clientValuesForDataEntry[propToInclude.clientId]),
        }));

    return [...standardValuesArray, ...specialValuesArray]
        .reduce((accConvertedValues, valueItem) => {
            accConvertedValues[valueItem.id] = valueItem.value;
            return accConvertedValues;
        }, {});
}

export function getDataEntryNotes(
    clientValuesForDataEntry: any,
): Array<any> {
    const notes = clientValuesForDataEntry.notes || [];
    return notes.map((note: any, index: number) => ({
        ...note,
        storedAt: note.storedAt,
        key: index,
    }));
}

export function getFormValues(
    clientValuesForForm: any,
    formFoundation: RenderFoundation,
) {
    const convertedValues = formFoundation.convertValues(clientValuesForForm);
    return convertedValues;
}

export function validateDataEntryValues(
    values: any,
    dataEntryPropsToInclude: Array<DataEntryPropToInclude>,
) {
    return dataEntryPropsToInclude
        .reduce((accValidations, propToInclude) => {
            const id = propToInclude.dataEntryId || propToInclude.id || Object.keys(propToInclude)[0];

            const value = values[id];
            const validationError = getValidationError(value, propToInclude.validatorContainers);

            accValidations[id] = {
                isValid: !validationError,
                validationError,
            };

            return accValidations;
        }, {});
}
