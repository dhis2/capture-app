// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { type DataElement, dataElementTypes } from '../../../metaData';
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
    [type: $Keys<typeof dataElementTypes>]: (metaData: DataElement, options: Object, context: Object) => any,
}

const fieldForTypes: FieldForTypes = {
    [dataElementTypes.EMAIL]: getTextFieldConfig,
    [dataElementTypes.TEXT]: getTextFieldConfig,
    [dataElementTypes.PHONE_NUMBER]: getTextFieldConfig,
    [dataElementTypes.LONG_TEXT]: (metaData: DataElement, options: Object, context: Object) => {
        const fieldConfig = getTextFieldConfig(metaData, options, context, { multiLine: true });
        return fieldConfig;
    },
    [dataElementTypes.NUMBER]: getTextFieldConfig,
    [dataElementTypes.NUMBER_RANGE]: getTextRangeFieldConfig,
    [dataElementTypes.INTEGER]: getTextFieldConfig,
    [dataElementTypes.INTEGER_RANGE]: getTextRangeFieldConfig,
    [dataElementTypes.INTEGER_POSITIVE]: getTextFieldConfig,
    [dataElementTypes.INTEGER_POSITIVE_RANGE]: getTextRangeFieldConfig,
    [dataElementTypes.INTEGER_NEGATIVE]: getTextFieldConfig,
    [dataElementTypes.INTEGER_NEGATIVE_RANGE]: getTextRangeFieldConfig,
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: getTextFieldConfig,
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE_RANGE]: getTextRangeFieldConfig,
    [dataElementTypes.BOOLEAN]: getBooleanFieldConfig,
    [dataElementTypes.TRUE_ONLY]: getTrueOnlyFieldConfig,
    [dataElementTypes.DATE]: (metaData: any, options: Object) => getDateFieldConfig(metaData, options),
    [dataElementTypes.DATE_RANGE]: getDateRangeFieldConfig,
    [dataElementTypes.DATETIME]: getDateTimeFieldConfig,
    [dataElementTypes.DATETIME_RANGE]: getDateTimeRangeFieldConfig,
    [dataElementTypes.TIME]: getTextFieldConfig,
    [dataElementTypes.TIME_RANGE]: getTextRangeFieldConfig,
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

export default function getDefaultFormField(metaData: DataElement, options: Object, context: Object) {
    if (options.viewMode) {
        return getViewModeFieldConfig(metaData, options);
    }

    const type = metaData.type;
    if (!fieldForTypes[type]) {
        log.warn(errorCreator(errorMessages.NO_FORMFIELD_FOR_TYPE)({ metaData }));
        return fieldForTypes[dataElementTypes.UNKNOWN](metaData, options, context);
    }

    if (metaData.optionSet) {
        return getOptionSetFieldConfig(metaData, options);
    }

    return fieldForTypes[type](metaData, options, context);
}
