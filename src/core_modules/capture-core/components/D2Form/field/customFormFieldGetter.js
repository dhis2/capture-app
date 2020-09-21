// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import MetaDataElement from '../../../metaData/DataElement/DataElement';
import { dataElementTypes } from '../../../metaData';
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
    [dataElementTypes.EMAIL]: getTextFieldConfig,
    [dataElementTypes.TEXT]: getTextFieldConfig,
    [dataElementTypes.PHONE_NUMBER]: getTextFieldConfig,
    [dataElementTypes.LONG_TEXT]: (metaData: MetaDataElement) => {
        const fieldConfig = getTextFieldConfig(metaData, { multiLine: true });
        return fieldConfig;
    },
    [dataElementTypes.NUMBER]: getTextFieldConfig,
    [dataElementTypes.INTEGER]: getTextFieldConfig,
    [dataElementTypes.INTEGER_POSITIVE]: getTextFieldConfig,
    [dataElementTypes.INTEGER_NEGATIVE]: getTextFieldConfig,
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: getTextFieldConfig,
    [dataElementTypes.BOOLEAN]: getBooleanFieldConfig,
    [dataElementTypes.TRUE_ONLY]: getTrueOnlyFieldConfig,
    [dataElementTypes.DATE]: getDateFieldConfig,
    [dataElementTypes.DATETIME]: getDateTimeFieldConfig,
    [dataElementTypes.TIME]: getTextFieldConfig,
    [dataElementTypes.PERCENTAGE]: getTextFieldConfig,
    [dataElementTypes.URL]: getTextFieldConfig,
    [dataElementTypes.AGE]: getAgeFieldConfig,
    [dataElementTypes.ORGANISATION_UNIT]: getOrgUnitFieldConfig,
    [dataElementTypes.COORDINATE]: getCoordinateFieldConfig,
    [dataElementTypes.POLYGON]: getPolygonFieldConfig,
    [dataElementTypes.USERNAME]: getUserNameFieldConfig,
    [dataElementTypes.FILE_RESOURCE]: getFileResourceFieldConfig,
    [dataElementTypes.IMAGE]: getImageFieldConfig,
    [dataElementTypes.UNKNOWN]: () => null,
};

export default function getCustomFormField(metaData: MetaDataElement, options: Object) {
    if (options.viewMode) {
        return getViewModeFieldConfig(metaData, options);
    }

    const type = metaData.type;
    // $FlowFixMe dataElementTypes flow error
    if (!fieldForTypes[type]) {
        log.warn(errorCreator(errorMessages.NO_FORMFIELD_FOR_TYPE)({ metaData }));
        // $FlowFixMe dataElementTypes flow error
        return fieldForTypes[dataElementTypes.UNKNOWN](metaData);
    }

    if (metaData.optionSet) {
        return getOptionSetFieldConfig(metaData, options);
    }

    // $FlowFixMe dataElementTypes flow error
    return fieldForTypes[type](metaData);
}
