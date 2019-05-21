// @flow
import log from 'loglevel';
import errorCreator from '../../../utils/errorCreator';
import MetaDataElement from '../../../metaData/DataElement/DataElement';
import elementTypes from '../../../metaData/DataElement/elementTypes';
import {
    getTextFieldConfig,
    getOrgUnitFieldConfig,
    getBooleanFieldConfig,
    getTrueOnlyFieldConfig,
    getDateFieldConfig,
    getDateTimeFieldConfig,
    getAgeFieldConfig,
    getCoordinateFieldConfig,
    getPolygonFieldConfig,
    getUserNameFieldConfig,
    getFileResourceFieldConfig,
    getImageFieldConfig,
    getOptionSetFieldConfig,
    getTextRangeFieldConfig,
    getDateRangeFieldConfig,
    getDateTimeRangeFieldConfig,
    getViewModeFieldConfig,
} from './configs';

const errorMessages = {
    NO_FORMFIELD_FOR_TYPE: 'Formfield component not specified for type',
};

type FieldForTypes = {
    [type: $Values<typeof elementTypes>]: (metaData: MetaDataElement, options: Object, context: Object) => any,
}

const fieldForTypes: FieldForTypes = {
    [elementTypes.EMAIL]: getTextFieldConfig,
    [elementTypes.TEXT]: getTextFieldConfig,
    [elementTypes.PHONE_NUMBER]: getTextFieldConfig,
    [elementTypes.LONG_TEXT]: (metaData: MetaDataElement, options: Object, context: Object) => {
        const fieldConfig = getTextFieldConfig(metaData, options, context, { multiLine: true });
        return fieldConfig;
    },
    [elementTypes.NUMBER]: getTextFieldConfig,
    [elementTypes.NUMBER_RANGE]: getTextRangeFieldConfig,
    [elementTypes.INTEGER]: getTextFieldConfig,
    [elementTypes.INTEGER_RANGE]: getTextRangeFieldConfig,
    [elementTypes.INTEGER_POSITIVE]: getTextFieldConfig,
    [elementTypes.INTEGER_POSITIVE_RANGE]: getTextRangeFieldConfig,
    [elementTypes.INTEGER_NEGATIVE]: getTextFieldConfig,
    [elementTypes.INTEGER_NEGATIVE_RANGE]: getTextRangeFieldConfig,
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: getTextFieldConfig,
    [elementTypes.INTEGER_ZERO_OR_POSITIVE_RANGE]: getTextRangeFieldConfig,
    [elementTypes.BOOLEAN]: getBooleanFieldConfig,
    [elementTypes.TRUE_ONLY]: getTrueOnlyFieldConfig,
    [elementTypes.DATE]: getDateFieldConfig,
    [elementTypes.DATE_RANGE]: getDateRangeFieldConfig,
    [elementTypes.DATETIME]: getDateTimeFieldConfig,
    [elementTypes.DATETIME_RANGE]: getDateTimeRangeFieldConfig,
    [elementTypes.TIME]: getTextFieldConfig,
    [elementTypes.TIME_RANGE]: getTextRangeFieldConfig,
    [elementTypes.PERCENTAGE]: getTextFieldConfig,
    [elementTypes.URL]: getTextFieldConfig,
    [elementTypes.AGE]: getAgeFieldConfig,
    [elementTypes.ORGANISATION_UNIT]: getOrgUnitFieldConfig,
    [elementTypes.COORDINATE]: getCoordinateFieldConfig,
    [elementTypes.POLYGON]: getPolygonFieldConfig,
    [elementTypes.USERNAME]: getUserNameFieldConfig,
    [elementTypes.FILE_RESOURCE]: getFileResourceFieldConfig,
    [elementTypes.IMAGE]: getImageFieldConfig,
    [elementTypes.UNKNOWN]: (metaData: MetaDataElement, options: Object) => null, // eslint-disable-line no-unused-vars
};

export default function getDefaultFormField(metaData: MetaDataElement, options: Object, context: Object) {
    if (options.viewMode) {
        return getViewModeFieldConfig(metaData, options);
    }

    const type = metaData.type;
    if (!fieldForTypes[type]) {
        log.warn(errorCreator(errorMessages.NO_FORMFIELD_FOR_TYPE)({ metaData }));
        return fieldForTypes[elementTypes.UNKNOWN](metaData, options, context);
    }

    if (metaData.optionSet) {
        return getOptionSetFieldConfig(metaData, options);
    }

    return fieldForTypes[type](metaData, options, context);
}
