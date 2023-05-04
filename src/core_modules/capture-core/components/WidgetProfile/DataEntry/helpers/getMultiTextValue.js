// @flow
import { dataElementTypes, DataElement, OptionSet, Option } from '../../../../metaData';
import { convertValue as convertClientToView } from '../../../../converters/clientToView';

export const getMultiTextValue = (
    clientValue: string,
    column: {
        attribute: string,
        valueType: $Keys<typeof dataElementTypes>,
        optionSet: { options: Array<{ name: string, code: string }> },
    },
) => {
    const dataElement = new DataElement((o) => {
        o.id = column.attribute;
        o.type = column.valueType;
    });

    if (column.optionSet) {
        const options = column.optionSet.options.map(
            option =>
                new Option((o) => {
                    o.text = option.name;
                    o.value = option.code;
                }),
        );
        const optionSet = new OptionSet(column.attribute, options, null, dataElement);
        dataElement.optionSet = optionSet;
    }
    return convertClientToView(clientValue, dataElement.type, dataElement);
};
