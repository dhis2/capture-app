// @flow
import { convertValue as convertToServerValue } from '../../../converters/clientToServer';
import { convertValue as convertToClientValue } from '../../../converters/formToClient';
import { dataElementTypes as elementTypes, OptionSet } from '../../../metaData';

const getRequestData = (values: Array<any>, type: $Values<typeof elementTypes>) => {
    const valueString = values
        .map((value) => {
            const clientValue = convertToClientValue(value, type);
            const filterValue = convertToServerValue(clientValue, type); // should work for now
            return filterValue;
        })
        .join(';');

    return `in:${valueString}`;
};

const getAppliedText = (values: Array<any>, optionSet: ?OptionSet) => {
    const valueString = values
        .map((value) => {
            const text = optionSet ? optionSet.getOptionText(value) : value;
            return text;
        })
        .join(', ');

    return valueString;
};

export default function (values: Array<any>, type: $Values<typeof elementTypes>, optionSet: ?OptionSet) {
    return {
        requestData: getRequestData(values, type),
        appliedText: getAppliedText(values, optionSet),
    };
}
