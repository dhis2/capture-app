
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import type { OptionSet } from '../../../../../metaData';
import { convertValue } from '../../../../../converters/clientToForm';

const errorMessages = {
    DATAELEMENT_MISSING: 'DataElement missing',
};

const buildFormOptionSet = (clientOptionSet: OptionSet) => {
    if (!clientOptionSet.dataElement) {
        log.error(errorCreator(errorMessages.DATAELEMENT_MISSING)({ clientOptionSet }));
        return null;
    }
    return clientOptionSet.dataElement.getConvertedOptionSet(convertValue);
};

const flattenOptionSetForRadioButtons = (formOptionSet: OptionSet) => formOptionSet
    .options
    .map(option => ({
        id: option.id,
        name: option.text,
        value: option.value,
    }));

const flattenOptionSetForSelect = (formOptionSet: OptionSet) => formOptionSet
    .options
    .map(({ id, text, value, icon }) => ({
        id,
        label: text,
        value,
        icon: icon ? {
            name: icon.name,
            color: icon.color,
        } : null,
    }));


export const getOptionsForRadioButtons = (clientOptionSet: OptionSet | null) => {
    if (!clientOptionSet) {
        return null;
    }
    const getOptionSet = (optionSet: OptionSet) => {
        const formOptionSet = buildFormOptionSet(optionSet);
        return formOptionSet ? flattenOptionSetForRadioButtons(formOptionSet) : null;
    };
    return getOptionSet(clientOptionSet);
};

export const getOptionsForSelect = (clientOptionSet: OptionSet | null) => {
    if (!clientOptionSet) {
        return null;
    }
    const getOptionSet = (optionSet: OptionSet) => {
        const formOptionSet = buildFormOptionSet(optionSet);
        return formOptionSet ? flattenOptionSetForSelect(formOptionSet) : null;
    };
    return getOptionSet(clientOptionSet);
};
