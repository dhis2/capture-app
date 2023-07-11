// @flow
import log from 'loglevel';
import { pipe, errorCreator } from 'capture-core-utils';
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

export const getOptionsForSelect = (clientOptionSet: OptionSet) => {
    const getOptionSet = pipe(
        buildFormOptionSet,
        flattenOptionSetForSelect,
    );
    return getOptionSet(clientOptionSet);
};
