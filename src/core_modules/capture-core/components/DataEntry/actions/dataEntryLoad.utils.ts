import { convertValue } from '../../../converters/clientToForm';
import type { RenderFoundation } from '../../../metaData';
import { DataElement } from '../../../metaData';
import { getValidationError } from '../dataEntryField/internal/dataEntryField.utils';
import type { ValidatorContainer } from '../dataEntryField/internal/dataEntryField.utils';

type DataEntryPropToIncludeStandard = {
    id: string,
    type: string,
    validatorContainers?: Array<ValidatorContainer>,
    clientIgnore?: boolean | null,
};

type DataEntryPropToIncludeSpecial = {
    clientId: string,
    dataEntryId: string,
    onConvertIn?: (value: any) => any,
    onConvertOut: (dataEntryValue: any, foundation: RenderFoundation, customFeatureType: string) => any,
    featureType?: string,
    validatorContainers?: Array<ValidatorContainer>,
};

export type DataEntryPropToInclude = DataEntryPropToIncludeStandard | DataEntryPropToIncludeSpecial;

export function getDataEntryMeta(dataEntryPropsToInclude: Array<DataEntryPropToInclude>) {
    return dataEntryPropsToInclude
        .reduce((accMeta, propToInclude) => {
            let propMeta;
            if ('type' in propToInclude) {
                propMeta = { type: propToInclude.type, clientIgnore: propToInclude.clientIgnore };
                accMeta[propToInclude.id] = propMeta;
            } else if (propToInclude.onConvertOut) {
                propMeta = {
                    onConvertOut: propToInclude.onConvertOut.toString(),
                    clientId: propToInclude.clientId,
                    featureType: propToInclude.featureType,
                };
                accMeta[propToInclude.dataEntryId] = propMeta;
            } else {
                propMeta = {};
            }

            return accMeta;
        }, {});
}

export function getDataEntryValues(
    dataEntryPropsToInclude: Array<DataEntryPropToInclude>,
    clientValuesForDataEntry: any,
) {
    const standardValuesArray = dataEntryPropsToInclude
        .filter(propToInclude => 'type' in propToInclude)
        .map((propToInclude: DataEntryPropToIncludeStandard) => new DataElement((o) => {
            o.id = propToInclude.id;
            o.type = propToInclude.type;
        }))
        .map(dataElement => ({
            id: dataElement.id,
            value: dataElement.convertValue(clientValuesForDataEntry[dataElement.id], convertValue),
        }));

    const specialValuesArray = dataEntryPropsToInclude
        .filter(propToInclude => 'dataEntryId' in propToInclude)
        .filter(propToInclude => propToInclude.onConvertIn && propToInclude.dataEntryId)
        .map(propToInclude => ({
            id: propToInclude.dataEntryId,
            value: propToInclude.onConvertIn?.(clientValuesForDataEntry[propToInclude.clientId]),
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
    const convertedValues = formFoundation.convertValues(clientValuesForForm, convertValue);
    return convertedValues;
}

export function validateDataEntryValues(
    values: any,
    dataEntryPropsToInclude: Array<DataEntryPropToInclude>,
) {
    return dataEntryPropsToInclude
        .reduce((accValidations, propToInclude) => {
            const id = 'dataEntryId' in propToInclude ? propToInclude.dataEntryId : propToInclude.id;

            const value = values[id];
            const validatorContainers = propToInclude.validatorContainers;
            const validationError = getValidationError(value, validatorContainers);

            accValidations[id] = {
                isValid: !validationError,
                validationError,
            };

            return accValidations;
        }, {});
}
