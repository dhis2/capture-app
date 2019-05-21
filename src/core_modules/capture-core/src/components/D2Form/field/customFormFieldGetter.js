// @flow
import log from 'loglevel';
import errorCreator from '../../../utils/errorCreator';
import MetaDataElement from '../../../metaData/DataElement/DataElement';
import elementTypes from '../../../metaData/DataElement/elementTypes';
import {
    getAgeFieldConfigForCustomForm as getAgeFieldConfig,
    getBooleanFieldConfigForCustomForm as getBooleanFieldConfig,
    getCoordinateFieldConfigForCustomForm as getCoordinateFieldConfig,
    getPolygonFieldConfigForCustomForm as getPolygonFieldConfig,
    getDateFieldConfigForCustomForm as getDateFieldConfig,
    getDateTimeFieldConfigForCustomForm as getDateTimeFieldConfig,
    getFileResourceFieldConfigForCustomForm as getFileResourceFieldConfig,
    getImageFieldConfigForCustomForm as getImageFieldConfig,
    getOptionSetFieldConfigForCustomForm as getOptionSetFieldConfig,
    getOrgUnitFieldConfigForCustomForm as getOrgUnitFieldConfig,
    getTextFieldConfigForCustomForm as getTextFieldConfig,
    getTrueOnlyFieldConfigForCustomForm as getTrueOnlyFieldConfig,
    getUserNameFieldConfigForCustomForm as getUserNameFieldConfig,
    getViewModeFieldConfigForCustomForm as getViewModeFieldConfig,
} from './configs';

const errorMessages = {
    NO_FORMFIELD_FOR_TYPE: 'Formfield component not specified for type',
};

const fieldForTypes = {
    [elementTypes.EMAIL]: getTextFieldConfig,
    [elementTypes.TEXT]: getTextFieldConfig,
    [elementTypes.PHONE_NUMBER]: getTextFieldConfig,
    [elementTypes.LONG_TEXT]: (metaData: MetaDataElement) => {
        const fieldConfig = getTextFieldConfig(metaData, { multiLine: true });
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
    [elementTypes.POLYGON]: getPolygonFieldConfig,
    [elementTypes.USERNAME]: getUserNameFieldConfig,
    [elementTypes.FILE_RESOURCE]: getFileResourceFieldConfig,
    [elementTypes.IMAGE]: getImageFieldConfig,
    [elementTypes.UNKNOWN]: (metaData: MetaDataElement) => null, // eslint-disable-line no-unused-vars
};

export default function getCustomFormField(metaData: MetaDataElement, options: Object) {
    if (options.viewMode) {
        return getViewModeFieldConfig(metaData, options);
    }

    const type = metaData.type;
    if (!fieldForTypes[type]) {
        log.warn(errorCreator(errorMessages.NO_FORMFIELD_FOR_TYPE)({ metaData }));
        return fieldForTypes[elementTypes.UNKNOWN](metaData);
    }

    if (metaData.optionSet) {
        return getOptionSetFieldConfig(metaData, options);
    }

    return fieldForTypes[type](metaData);
}
