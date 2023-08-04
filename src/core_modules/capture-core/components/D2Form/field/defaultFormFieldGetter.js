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
    getMultiOptionSetFieldConfig,
    getTextRangeFieldConfig,
    getDateRangeFieldConfig,
    getDateTimeRangeFieldConfig,
    getViewModeFieldConfig,
} from './configs';
import type { QuerySingleResource } from '../../../utils/api/api.types';

const errorMessages = {
    NO_FORMFIELD_FOR_TYPE: 'Formfield component not specified for type',
};

type FieldForTypes = {
    [type: $Keys<typeof dataElementTypes>]: (
        metaData: DataElement,
        options: Object,
        querySingleResource: QuerySingleResource,
    ) => any,
}

const fieldForTypes: FieldForTypes = {
    [dataElementTypes.EMAIL]: getTextFieldConfig,
    [dataElementTypes.TEXT]: getTextFieldConfig,
    [dataElementTypes.MULTI_TEXT]: getMultiOptionSetFieldConfig,
    [dataElementTypes.PHONE_NUMBER]: getTextFieldConfig,
    [dataElementTypes.LONG_TEXT]:
    (metaData: DataElement, options: Object, querySingleResource: QuerySingleResource) => {
        const fieldConfig = getTextFieldConfig(metaData, options, querySingleResource, { multiLine: true });
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
    [dataElementTypes.DATE]: (metaData: any, options: Object, querySingleResource: QuerySingleResource) =>
        getDateFieldConfig(metaData, options, querySingleResource),
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

export function getDefaultFormField(metaData: DataElement, options: Object, querySingleResource: QuerySingleResource) {
    if (options.viewMode) {
        return getViewModeFieldConfig(metaData, options);
    }

    const type = metaData.type;
    if (!fieldForTypes[type]) {
        log.warn(errorCreator(errorMessages.NO_FORMFIELD_FOR_TYPE)({ metaData }));
        return fieldForTypes[dataElementTypes.UNKNOWN](metaData, options, querySingleResource);
    }

    if (metaData.optionSet && metaData.type !== dataElementTypes.MULTI_TEXT) {
        return getOptionSetFieldConfig(metaData, options, querySingleResource);
    }

    return fieldForTypes[type](metaData, options, querySingleResource);
}
