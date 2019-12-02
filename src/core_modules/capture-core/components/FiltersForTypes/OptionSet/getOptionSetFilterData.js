// @flow
import { dataElementTypes as elementTypes, OptionSet } from '../../../metaData';
import { convertValue as convertToServerValue } from '../../../converters/clientToServer';
import { convertValue as convertToClientValue } from '../../../converters/formToClient';

/*
const getMultiSelectRequestData = (values: Array<any>, type: $Values<typeof elementTypes>) => {
    const valueString = values
        .map((value) => {
            const clientValue = convertToClientValue(value, type);
            const filterValue = convertToServerValue(clientValue, type); // should work for now
            return filterValue;
        })
        .join(';');

    return `in:${valueString}`;
};

const getMultiSelectAppliedText = (values: Array<any>, optionSet: OptionSet) => {
    const valueString = values
        .map((value) => {
            const text = optionSet.getOptionText(value);
            return text;
        })
        .join(', ');

    return valueString;
};

export const getMultiSelectOptionSetFilterData =
    (value: Array<any>, type: $Values<typeof elementTypes>, optionSet: OptionSet) => ({
        requestData: getMultiSelectRequestData(value, type),
        appliedText: getMultiSelectAppliedText(value, optionSet),
    });

export const getSingleSelectOptionSetFilterData =
    (value: any, optionSet: OptionSet) => ({
        requestData: `eq:${value}`,
        appliedText: optionSet.getOptionText(value),
    });

*/

function getSelectOptionSetFilterData(
    values: Array<any>,
    type: $Values<typeof elementTypes>,
): { optionSet: boolean, values: Array<any> } {
    return {
        optionSet: true,
        values: values
            .map(value => convertToClientValue(value, type)),
    };
}

export const getMultiSelectOptionSetFilterData = getSelectOptionSetFilterData;

export const getSingleSelectOptionSetFilterData = (
    value: any,
    type: $Values<typeof elementTypes>,
) => getSelectOptionSetFilterData([value], type);
