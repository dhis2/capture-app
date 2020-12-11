// @flow
import isString from 'd2-utilizr/lib/isString';
import i18n from '@dhis2/d2-i18n';
import {
  hasValue,
  isValidEmail,
  isValidInteger,
  isValidNegativeInteger,
  isValidPositiveInteger,
  isValidZeroOrPositiveInteger,
  isValidNumber,
  isValidPercentage,
  isValidTime,
  isValidUrl,
  isValidPhoneNumber,
  isValidOrgUnit,
  isValidCoordinate,
} from 'capture-core-utils/validators/form';
import {
  isValidAge,
  isValidDate,
  isValidNonFutureDate,
  isValidDateTime,
  getNumberRangeValidator,
  getDateRangeValidator,
  getDateTimeRangeValidator,
  getTimeRangeValidator,
} from '../../../../utils/validators/form';
import { dataElementTypes, type DateDataElement, type DataElement } from '../../../../metaData';
import { validatorTypes } from './constants';

type Validator = (
  value: any,
) => Promise<boolean> | boolean | { valid: boolean, errorMessage?: any };

type ValidatorContainer = {
  validator: Validator,
  message: string,
  type?: string,
  validatingMessage?: string,
};

const errorMessages = {
  COMPULSORY: i18n.t('A value is required'),
  NUMBER: i18n.t('Please provide a valid number'),
  INTEGER: i18n.t('Please provide a valid integer'),
  POSITIVE_INTEGER: i18n.t('Please provide a positive integer'),
  ZERO_OR_POSITIVE_INTEGER: i18n.t('Please provide zero or a positive integer'),
  NEGATIVE_INTEGER: i18n.t('Please provide a negative integer'),
  DATE: i18n.t('Please provide a valid date'),
  DATE_FUTURE_NOT_ALLOWED: i18n.t('A date in the future is not allowed'),
  DATETIME: i18n.t('Please provide a valid date and time'),
  TIME: i18n.t('Please provide a valid time'),
  PERCENTAGE: i18n.t('Please provide a valid percentage'),
  URL: i18n.t('Please provide a valid url'),
  EMAIL: i18n.t('Please provide a valid email address'),
  AGE: i18n.t('Please provide a valid age'),
  PHONE_NUMBER: i18n.t('Please provide a valid phone number'),
  ORGANISATION_UNIT: i18n.t('Please provide a valid organisation unit'),
  COORDINATE: i18n.t('Please provide valid coordinates'),
  UNIQUENESS: i18n.t('This value already exists'),
  RANGE: i18n.t('"From" cannot be greater than "To"'),
};

const validationMessages = {
  UNIQUENESS: i18n.t('Checking...'),
};

const compulsoryValidatorWrapper = (value: any) => {
  const trimmedValue = value && isString(value) ? value.trim() : value;
  return hasValue(trimmedValue);
};

const validatorForInteger = {
  validator: isValidInteger,
  message: errorMessages.INTEGER,
  type: validatorTypes.TYPE_BASE,
};

const validatorForPositiveInteger = {
  validator: isValidPositiveInteger,
  message: errorMessages.POSITIVE_INTEGER,
  type: validatorTypes.TYPE_BASE,
};

const validatorForZeroOrPositiveInteger = {
  validator: isValidZeroOrPositiveInteger,
  message: errorMessages.ZERO_OR_POSITIVE_INTEGER,
  type: validatorTypes.TYPE_BASE,
};

const validatorForNegativeInteger = {
  validator: isValidNegativeInteger,
  message: errorMessages.NEGATIVE_INTEGER,
  type: validatorTypes.TYPE_BASE,
};

const validatorForNumber = {
  validator: isValidNumber,
  message: errorMessages.NUMBER,
  type: validatorTypes.TYPE_BASE,
};

const validatorsForTypes = {
  [dataElementTypes.NUMBER]: [validatorForNumber],
  [dataElementTypes.INTEGER]: [validatorForInteger],
  [dataElementTypes.INTEGER_POSITIVE]: [validatorForPositiveInteger],
  [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: [validatorForZeroOrPositiveInteger],
  [dataElementTypes.INTEGER_NEGATIVE]: [validatorForNegativeInteger],
  [dataElementTypes.TIME]: [
    {
      validator: isValidTime,
      message: errorMessages.TIME,
      type: validatorTypes.TYPE_BASE,
    },
  ],
  [dataElementTypes.DATE]: [
    {
      validator: isValidDate,
      message: errorMessages.DATE,
      type: validatorTypes.TYPE_BASE,
    },
    {
      validator: (value: string, allowFutureDate) =>
        allowFutureDate ? true : isValidNonFutureDate(value),
      type: validatorTypes.TYPE_EXTENDED,
      message: errorMessages.DATE_FUTURE_NOT_ALLOWED,
    },
  ],
  [dataElementTypes.DATETIME]: [
    {
      validator: isValidDateTime,
      message: errorMessages.DATETIME,
      type: validatorTypes.TYPE_BASE,
    },
  ],
  [dataElementTypes.EMAIL]: [
    {
      validator: isValidEmail,
      message: errorMessages.EMAIL,
      type: validatorTypes.TYPE_BASE,
    },
  ],
  [dataElementTypes.PERCENTAGE]: [
    {
      validator: isValidPercentage,
      message: errorMessages.PERCENTAGE,
      type: validatorTypes.TYPE_BASE,
    },
  ],
  [dataElementTypes.URL]: [
    {
      validator: isValidUrl,
      message: errorMessages.URL,
      type: validatorTypes.TYPE_BASE,
    },
  ],
  [dataElementTypes.AGE]: [
    {
      validator: isValidAge,
      message: errorMessages.AGE,
      type: validatorTypes.TYPE_BASE,
    },
  ],
  [dataElementTypes.PHONE_NUMBER]: [
    {
      validator: isValidPhoneNumber,
      message: errorMessages.PHONE_NUMBER,
      type: validatorTypes.TYPE_BASE,
    },
  ],
  [dataElementTypes.ORGANISATION_UNIT]: [
    {
      validator: isValidOrgUnit,
      message: errorMessages.ORGANISATION_UNIT,
      type: validatorTypes.TYPE_BASE,
    },
  ],
  [dataElementTypes.COORDINATE]: [
    {
      validator: isValidCoordinate,
      message: errorMessages.COORDINATE,
      type: validatorTypes.TYPE_BASE,
    },
  ],
  [dataElementTypes.DATE_RANGE]: [
    {
      validator: getDateRangeValidator(errorMessages.DATE),
      message: errorMessages.RANGE,
      type: validatorTypes.TYPE_BASE,
    },
  ],
  [dataElementTypes.DATETIME_RANGE]: [
    {
      validator: getDateTimeRangeValidator(errorMessages.DATETIME),
      message: errorMessages.RANGE,
      type: validatorTypes.TYPE_BASE,
    },
  ],
  [dataElementTypes.TIME_RANGE]: [
    {
      validator: getTimeRangeValidator(errorMessages.TIME),
      message: errorMessages.RANGE,
      type: validatorTypes.TYPE_BASE,
    },
  ],
  [dataElementTypes.NUMBER_RANGE]: [
    {
      validator: getNumberRangeValidator(validatorForNumber),
      message: errorMessages.RANGE,
      type: validatorTypes.TYPE_BASE,
    },
  ],
  [dataElementTypes.INTEGER_RANGE]: [
    {
      validator: getNumberRangeValidator(validatorForInteger),
      message: errorMessages.RANGE,
      type: validatorTypes.TYPE_BASE,
    },
  ],
  [dataElementTypes.INTEGER_POSITIVE_RANGE]: [
    {
      validator: getNumberRangeValidator(validatorForPositiveInteger),
      message: errorMessages.RANGE,
      type: validatorTypes.TYPE_BASE,
    },
  ],
  [dataElementTypes.INTEGER_ZERO_OR_POSITIVE_RANGE]: [
    {
      validator: getNumberRangeValidator(validatorForZeroOrPositiveInteger),
      message: errorMessages.RANGE,
      type: validatorTypes.TYPE_BASE,
    },
  ],
  [dataElementTypes.INTEGER_NEGATIVE_RANGE]: [
    {
      validator: getNumberRangeValidator(validatorForNegativeInteger),
      message: errorMessages.RANGE,
      type: validatorTypes.TYPE_BASE,
    },
  ],
};

function buildTypeValidators(metaData: DataElement | DateDataElement): Array<?ValidatorContainer> {
  // $FlowFixMe dataElementTypes flow error
  let validatorContainersForType = validatorsForTypes[metaData.type]
    ? validatorsForTypes[metaData.type]
    : [];

  validatorContainersForType = validatorContainersForType.map((validatorContainer) => ({
    ...validatorContainer,
    validator: (value: any) => {
      if (!value && value !== 0 && value !== false) {
        return true;
      }

      const toValidateValue = isString(value) ? value.trim() : value;
      return validatorContainer.validator(
        toValidateValue,
        // $FlowFixMe dataElementTypes flow error
        metaData.allowFutureDate,
      );
    },
  }));

  return validatorContainersForType;
}

function buildCompulsoryValidator(metaData: DataElement): Array<?ValidatorContainer> {
  return metaData.compulsory
    ? [
        {
          validator: compulsoryValidatorWrapper,
          message: errorMessages.COMPULSORY,
        },
      ]
    : [];
}

function buildUniqueValidator(metaData: DataElement): Array<?ValidatorContainer> {
  return metaData.unique
    ? [
        {
          validator: (value: any, contextProps: ?Object) => {
            if (!value && value !== 0 && value !== false) {
              return true;
            }
            // $FlowFixMe
            return metaData.unique.onValidate(value, contextProps);
          },
          message: errorMessages.UNIQUENESS,
          validatingMessage: validationMessages.UNIQUENESS,
          type: validatorTypes.UNIQUE,
        },
      ]
    : [];
}

export const getValidators = (metaData: DataElement): Array<?ValidatorContainer> =>
  [
    buildCompulsoryValidator,
    buildTypeValidators,
    buildUniqueValidator,
  ].flatMap((validatorBuilder) => validatorBuilder(metaData));
