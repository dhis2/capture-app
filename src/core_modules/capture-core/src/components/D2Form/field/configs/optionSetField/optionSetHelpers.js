// @flow
import log from 'loglevel';
import pipe from '../../../../../utils/pipe';
import errorCreator from '../../../../../utils/errorCreator';
import OptionSet from '../../../../../metaData/OptionSet/OptionSet';
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

const flattenOptionSet = (formOptionSet: OptionSet) => formOptionSet
    .options
    .map(option => ({
        name: option.text,
        value: option.value,
    }));

export const getOptions = (clientOptionSet: OptionSet) => {
    const getOptionSet = pipe(
        buildFormOptionSet,
        flattenOptionSet,
    );
    return getOptionSet(clientOptionSet);
};

export const getFormOptionSet = buildFormOptionSet;
