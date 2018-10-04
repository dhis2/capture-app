// @flow
import log from 'loglevel';
import errorCreator from '../../../utils/errorCreator';
import {
    getTextFieldConfig,
    getOrgUnitFieldConfig,
    getBooleanFieldConfig,
    getTrueOnlyFieldConfig,
    getDateFieldConfig,
    getDateTimeFieldConfig,
    getAgeFieldConfig,
    getCoordinateFieldConfig,
    getUserNameFieldConfig,
    getFileResourceFieldConfig,
    getImageFieldConfig,
    getOptionSetFieldConfig,
} from './configs';

import MetaDataElement from '../../../metaData/DataElement/DataElement';
import elementTypes from '../../../metaData/DataElement/elementTypes';

const errorMessages = {
    NO_FORMFIELD_FOR_TYPE: 'Formfield component not specified for type',
};

const fieldForTypes = {
    [elementTypes.EMAIL]: getTextFieldConfig,
    [elementTypes.TEXT]: getTextFieldConfig,
    [elementTypes.PHONE_NUMBER]: getTextFieldConfig,
    [elementTypes.LONG_TEXT]: (metaData: MetaDataElement, options: Object) => {
        const fieldConfig = getTextFieldConfig(metaData, options, { multiLine: true });
        return fieldConfig;
    },
    [elementTypes.NUMBER]: getTextFieldConfig,
    [elementTypes.INTEGER]: getTextFieldConfig,
    [elementTypes.INTEGER_POSITIVE]: getTextFieldConfig,
    [elementTypes.INTEGER_NEGATIVE]: getTextFieldConfig,
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: getTextFieldConfig,
    [elementTypes.BOOLEAN]: getBooleanFieldConfig,
    [elementTypes.TRUE_ONLY]: getTrueOnlyFieldConfig,
    [elementTypes.DATE]: getDateFieldConfig,
    [elementTypes.DATETIME]: getDateTimeFieldConfig,
    [elementTypes.TIME]: getTextFieldConfig,
    [elementTypes.PERCENTAGE]: getTextFieldConfig,
    [elementTypes.URL]: getTextFieldConfig,
    [elementTypes.AGE]: getAgeFieldConfig,
    [elementTypes.ORGANISATION_UNIT]: getOrgUnitFieldConfig,
    [elementTypes.COORDINATE]: getCoordinateFieldConfig,
    [elementTypes.USERNAME]: getUserNameFieldConfig,
    [elementTypes.FILE_RESOURCE]: getFileResourceFieldConfig,
    [elementTypes.IMAGE]: getImageFieldConfig,
    [elementTypes.UNKNOWN]: (metaData: MetaDataElement, options: Object) => null, // eslint-disable-line no-unused-vars
};

export default function buildField(metaData: MetaDataElement, options: Object): ?Field {
    const type = metaData.type;
    if (!fieldForTypes[type]) {
        log.warn(errorCreator(errorMessages.NO_FORMFIELD_FOR_TYPE)({ metaData }));
        return fieldForTypes[elementTypes.UNKNOWN](metaData, options);
    }

    if (metaData.optionSet) {
        return getOptionSetFieldConfig(metaData, options);
    }

    return fieldForTypes[type](metaData, options);
}
