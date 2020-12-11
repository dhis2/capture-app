// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
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

// todo report (lgmt)
const fieldForTypes = {
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.EMAIL]: getTextFieldConfig,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.TEXT]: getTextFieldConfig,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.PHONE_NUMBER]: getTextFieldConfig,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.LONG_TEXT]: (metaData: MetaDataElement) => {
        const fieldConfig = getTextFieldConfig(metaData, { multiLine: true });
        return fieldConfig;
    },
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.NUMBER]: getTextFieldConfig,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER]: getTextFieldConfig,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_POSITIVE]: getTextFieldConfig,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_NEGATIVE]: getTextFieldConfig,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: getTextFieldConfig,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.BOOLEAN]: getBooleanFieldConfig,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.TRUE_ONLY]: getTrueOnlyFieldConfig,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.DATE]: getDateFieldConfig,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.DATETIME]: getDateTimeFieldConfig,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.TIME]: getTextFieldConfig,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.PERCENTAGE]: getTextFieldConfig,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.URL]: getTextFieldConfig,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.AGE]: getAgeFieldConfig,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.ORGANISATION_UNIT]: getOrgUnitFieldConfig,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.COORDINATE]: getCoordinateFieldConfig,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.POLYGON]: getPolygonFieldConfig,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.USERNAME]: getUserNameFieldConfig,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.FILE_RESOURCE]: getFileResourceFieldConfig,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.IMAGE]: getImageFieldConfig,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.UNKNOWN]: (metaData: MetaDataElement) => null, // eslint-disable-line no-unused-vars
};

export default function getCustomFormField(metaData: MetaDataElement, options: Object) {
    if (options.viewMode) {
        return getViewModeFieldConfig(metaData, options);
    }

    const {type} = metaData;
    if (!fieldForTypes[type]) {
        log.warn(errorCreator(errorMessages.NO_FORMFIELD_FOR_TYPE)({ metaData }));
        // $FlowFixMe[prop-missing] automated comment
        return fieldForTypes[elementTypes.UNKNOWN](metaData);
    }

    if (metaData.optionSet) {
        return getOptionSetFieldConfig(metaData, options);
    }

    return fieldForTypes[type](metaData);
}
