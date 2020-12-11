// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
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
  [type: $Values<typeof elementTypes>]: (
    metaData: MetaDataElement,
    options: Object,
    context: Object,
  ) => any,
};

// todo report (lgmt)
const fieldForTypes: FieldForTypes = {
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.EMAIL]: getTextFieldConfig,
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.TEXT]: getTextFieldConfig,
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.PHONE_NUMBER]: getTextFieldConfig,
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.LONG_TEXT]: (metaData: MetaDataElement, options: Object, context: Object) => {
    const fieldConfig = getTextFieldConfig(metaData, options, context, { multiLine: true });
    return fieldConfig;
  },
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.NUMBER]: getTextFieldConfig,
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.NUMBER_RANGE]: getTextRangeFieldConfig,
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.INTEGER]: getTextFieldConfig,
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.INTEGER_RANGE]: getTextRangeFieldConfig,
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.INTEGER_POSITIVE]: getTextFieldConfig,
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.INTEGER_POSITIVE_RANGE]: getTextRangeFieldConfig,
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.INTEGER_NEGATIVE]: getTextFieldConfig,
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.INTEGER_NEGATIVE_RANGE]: getTextRangeFieldConfig,
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.INTEGER_ZERO_OR_POSITIVE]: getTextFieldConfig,
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.INTEGER_ZERO_OR_POSITIVE_RANGE]: getTextRangeFieldConfig,
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.BOOLEAN]: getBooleanFieldConfig,
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.TRUE_ONLY]: getTrueOnlyFieldConfig,
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.DATE]: getDateFieldConfig,
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.DATE_RANGE]: getDateRangeFieldConfig,
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.DATETIME]: getDateTimeFieldConfig,
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.DATETIME_RANGE]: getDateTimeRangeFieldConfig,
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.TIME]: getTextFieldConfig,
  // $FlowFixMe[prop-missing] automated comment
  [elementTypes.TIME_RANGE]: getTextRangeFieldConfig,
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
  [elementTypes.UNKNOWN]: (metaData: MetaDataElement, options: Object) => null, // eslint-disable-line no-unused-vars
};

export default function getDefaultFormField(
  metaData: MetaDataElement,
  options: Object,
  context: Object,
) {
  if (options.viewMode) {
    return getViewModeFieldConfig(metaData, options);
  }

  const { type } = metaData;
  if (!fieldForTypes[type]) {
    log.warn(errorCreator(errorMessages.NO_FORMFIELD_FOR_TYPE)({ metaData }));
    // $FlowFixMe[prop-missing] automated comment
    return fieldForTypes[elementTypes.UNKNOWN](metaData, options, context);
  }

  if (metaData.optionSet) {
    return getOptionSetFieldConfig(metaData, options);
  }

  return fieldForTypes[type](metaData, options, context);
}
