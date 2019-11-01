// @flow
import i18n from '@dhis2/d2-i18n';
import { convertValue as convertToServerValue } from '../../../converters/clientToServer';
import { convertValue as convertToClientValue } from '../../../converters/formToClient';
import { dataElementTypes as elementTypes } from '../../../metaData';

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

const getAppliedText = (values: Array<any>) => {
    const valueString = values
        .map(() => {
            const text = i18n.t('Yes');
            return text;
        })
        .join(', ');

    return valueString;
};

export default function (value: Array<any>, type: $Values<typeof elementTypes>) {
    return {
        requestData: getRequestData(value, type),
        appliedText: getAppliedText(value),
    };
}
