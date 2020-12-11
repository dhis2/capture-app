// @flow
import DataElement from '../../../metaData/DataElement/DataElement';
import { convertValue } from '../../../converters/clientToForm';
import { convertValue as convertListValue } from '../../../converters/clientToList';
import RenderFoundation from '../../../metaData/RenderFoundation/RenderFoundation';
import elementTypes from '../../../metaData/DataElement/elementTypes';

import { getValidationError } from '../dataEntryField/internal/dataEntryField.utils';
import type { ValidatorContainer } from '../dataEntryField/internal/dataEntryField.utils';

type DataEntryPropToIncludeStandard = {|
    id: string,
    type: string,
    validatorContainers?: ?Array<ValidatorContainer>,
    clientIgnore?: ?boolean,
|};

type DataEntryPropToIncludeSpecial = {|
    clientId: string,
    dataEntryId: string,
    onConvertIn: (value: any) => any,
    onConvertOut: (dataEntryValue: any, prevValue: any, foundation: RenderFoundation) => any,
    validatorContainers?: ?Array<ValidatorContainer>,
|};

export type DataEntryPropToInclude = DataEntryPropToIncludeStandard | DataEntryPropToIncludeSpecial;

export function getDataEntryMeta(dataEntryPropsToInclude: Array<DataEntryPropToInclude>) {
    return dataEntryPropsToInclude
        .reduce((accMeta, propToInclude) => {
            let propMeta;
            if (propToInclude.type) {
                propMeta = { type: propToInclude.type };
            } else if (propToInclude.onConvertOut) {
                propMeta = { onConvertOut: propToInclude.onConvertOut.toString(), clientId: propToInclude.clientId };
            } else {
                propMeta = {};
            }

            // $FlowFixMe[prop-missing] automated comment
            propMeta.clientIgnore = propToInclude.clientIgnore;

            // $FlowFixMe[prop-missing] automated comment
            accMeta[propToInclude.id || propToInclude.dataEntryId] = propMeta;
            return accMeta;
        }, {});
}

export function getDataEntryValues(
    dataEntryPropsToInclude: Array<DataEntryPropToInclude>,
    clientValuesForDataEntry: Object,
) {
    const standardValuesArray = dataEntryPropsToInclude
        // $FlowFixMe[prop-missing] automated comment
        .filter(propToInclude => propToInclude.type)
        // $FlowFixMe[prop-missing] automated comment
        .map((propToInclude: DataEntryPropToIncludeStandard) => new DataElement((o) => {
            o.id = propToInclude.id;
            o.type = propToInclude.type;
        }))
        .map(dataElement => ({
            id: dataElement.id,
            value: dataElement.convertValue(clientValuesForDataEntry[dataElement.id], convertValue),
        }));

    const specialValuesArray = dataEntryPropsToInclude
        // $FlowFixMe[prop-missing] automated comment
        .filter(propToInclude => propToInclude.onConvertIn)
        // $FlowFixMe[prop-missing] automated comment
        .map((propToInclude: DataEntryPropToIncludeSpecial) => ({
            id: propToInclude.dataEntryId,
            value: propToInclude.onConvertIn(clientValuesForDataEntry[propToInclude.clientId]),
        }));

    return [...standardValuesArray, ...specialValuesArray]
        .reduce((accConvertedValues, valueItem: { id: string, value: any }) => {
            accConvertedValues[valueItem.id] = valueItem.value;
            return accConvertedValues;
        }, {});
}

export function getDataEntryNotes(
    clientValuesForDataEntry: Object,
): Array<Object> {
    const notes = clientValuesForDataEntry.notes || [];
    return notes.map((note, index) => ({
        ...note,
        // $FlowFixMe[prop-missing] automated comment
        storedDate: convertListValue(note.storedDate, elementTypes.DATETIME),
        key: index,
    }));
}

export function getFormValues(
    clientValuesForForm: Object,
    formFoundation: RenderFoundation,
) {
    const convertedValues = formFoundation.convertValues(clientValuesForForm, convertValue);
    return convertedValues;
}

export function validateDataEntryValues(
    values: {[key: string]: any},
    dataEntryPropsToInclude: Array<DataEntryPropToInclude>,
) {
    return dataEntryPropsToInclude
        .reduce((accValidations, propToInclude) => {
            // $FlowFixMe[prop-missing] automated comment
            const id = propToInclude.dataEntryId || propToInclude.id;
            const value = values[id];
            const {validatorContainers} = propToInclude;
            const validationError = getValidationError(value, validatorContainers);

            accValidations[id] = {
                isValid: !validationError,
                validationError,
            };

            return accValidations;
        }, {});
}
