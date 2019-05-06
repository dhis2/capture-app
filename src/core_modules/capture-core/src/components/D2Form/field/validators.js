// @flow
import { Validators } from '@dhis2/d2-ui-forms';
import isArray from 'd2-utilizr/src/isArray';
import isString from 'd2-utilizr/src/isString';
import i18n from '@dhis2/d2-i18n';

import {
    isValidDate,
    isValidDateTime,
    isValidEmail,
    isValidInteger,
    isValidNegativeInteger,
    isValidPositiveInteger,
    isValidZeroOrPositiveInteger,
    isValidNumber,
    isValidPercentage,
    isValidTime,
    isValidUrl,
    isValidAge,
    isValidPhoneNumber,
    isValidOrgUnit,
    isValidCoordinate,
    isValidUsername,
    getNumberRangeValidator,
    getDateRangeValidator,
    getDateTimeRangeValidator,
    getTimeRangeValidator,
} from '../../../utils/validators/form';
import { DataElement as MetaDataElement } from '../../../metaData';
import elementTypes from '../../../metaData/DataElement/elementTypes';

type Validator = (value: any) => boolean;

type ValidatorContainer = {
    validator: Validator,
    message: string
}

type ValidatorBuilder = (metaData: MetaDataElement) => Array<ValidatorContainer>;

const wordValidatorKeys = {
    COMPULSORY: 'required',
};

const errorMessages = {
    COMPULSORY: i18n.t('A value is required'),
    NUMBER: i18n.t('Please provide a valid number'),
    INTEGER: i18n.t('Please provide a valid integer'),
    POSITIVE_INTEGER: i18n.t('Please provide a positive integer'),
    ZERO_OR_POSITIVE_INTEGER: i18n.t('Please provide zero or a positive integer'),
    NEGATIVE_INTEGER: i18n.t('Please provide a negative integer'),
    DATE: i18n.t('Please provide a valid date'),
    DATETIME: i18n.t('Please provide a valid date and time'),
    TIME: i18n.t('Please provide a valid time'),
    PERCENTAGE: i18n.t('Please provide a valid percentage'),
    URL: i18n.t('Please provide a valid url'),
    EMAIL: i18n.t('Please provide a valid email address'),
    AGE: i18n.t('Please provide a valid age'),
    PHONE_NUMBER: i18n.t('Please provide a valid phone number'),
    ORGANISATION_UNIT: i18n.t('Please provide a valid organisation unit'),
    COORDINATE: i18n.t('Please provide valid coordinates'),
    USERNAME: i18n.t('Please provide a valid username'),
    UNIQUENESS: i18n.t('This value already exists'),
    RANGE: i18n.t('"From" cannot be greater than "To"'),
};

const validationMessages = {
    UNIQUENESS: i18n.t('Checking...'),
};

const compulsoryValidator = Validators.wordToValidatorMap.get(wordValidatorKeys.COMPULSORY);

const compulsoryValidatorWrapper = (value: any) => {
    const testValue = (value && isString(value)) ? value.trim() : value;
    return compulsoryValidator(testValue);
};

const validatorForInteger = () => ({
    validator: isValidInteger,
    message: errorMessages.INTEGER,
});

const validatorForPositiveInteger = () => ({
    validator: isValidPositiveInteger,
    message: errorMessages.POSITIVE_INTEGER,
});

const validatorForZeroOrPositiveInteger = () => ({
    validator: isValidZeroOrPositiveInteger,
    message: errorMessages.ZERO_OR_POSITIVE_INTEGER,
});

const validatorForNegativeInteger = () => ({
    validator: isValidNegativeInteger,
    message: errorMessages.NEGATIVE_INTEGER,
});

const validatorForNumber = () => ({
    validator: isValidNumber,
    message: errorMessages.NUMBER,
});

const validatorsForTypes = {
    [elementTypes.NUMBER]: validatorForNumber,
    [elementTypes.INTEGER]: validatorForInteger,
    [elementTypes.INTEGER_POSITIVE]: validatorForPositiveInteger,
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: validatorForZeroOrPositiveInteger,
    [elementTypes.INTEGER_NEGATIVE]: validatorForNegativeInteger,
    [elementTypes.TIME]: () => ({
        validator: isValidTime,
        message: errorMessages.TIME,
    }),
    [elementTypes.DATE]: () => ({
        validator: isValidDate,
        message: errorMessages.DATE,
    }),
    [elementTypes.DATETIME]: () => ({
        validator: isValidDateTime,
        message: errorMessages.DATETIME,
    }),
    [elementTypes.EMAIL]: () => ({
        validator: isValidEmail,
        message: errorMessages.EMAIL,
    }),
    [elementTypes.PERCENTAGE]: () => ({
        validator: isValidPercentage,
        message: errorMessages.PERCENTAGE,
    }),
    [elementTypes.URL]: () => ({
        validator: isValidUrl,
        message: errorMessages.URL,
    }),
    [elementTypes.AGE]: () => ({
        validator: isValidAge,
        message: errorMessages.AGE,
    }),
    [elementTypes.PHONE_NUMBER]: () => ({
        validator: isValidPhoneNumber,
        message: errorMessages.PHONE_NUMBER,
    }),
    [elementTypes.ORGANISATION_UNIT]: () => ({
        validator: isValidOrgUnit,
        message: errorMessages.ORGANISATION_UNIT,
    }),
    [elementTypes.COORDINATE]: () => ({
        validator: isValidCoordinate,
        message: errorMessages.COORDINATE,
    }),
    [elementTypes.USERNAME]: () => ({
        validator: isValidUsername,
        message: errorMessages.USERNAME,
    }),
    [elementTypes.DATE_RANGE]: () => ({
        validator: getDateRangeValidator(errorMessages.DATE),
        message: errorMessages.RANGE,
    }),
    [elementTypes.DATETIME_RANGE]: () => ({
        validator: getDateTimeRangeValidator(errorMessages.DATETIME),
        message: errorMessages.RANGE,
    }),
    [elementTypes.TIME_RANGE]: () => ({
        validator: getTimeRangeValidator(errorMessages.TIME),
        message: errorMessages.RANGE,
    }),
    [elementTypes.NUMBER_RANGE]: () => ({
        validator: getNumberRangeValidator(validatorForNumber()),
        message: errorMessages.RANGE,
    }),
    [elementTypes.INTEGER_RANGE]: () => ({
        validator: getNumberRangeValidator(validatorForInteger()),
        message: errorMessages.RANGE,
    }),
    [elementTypes.INTEGER_POSITIVE_RANGE]: () => ({
        validator: getNumberRangeValidator(validatorForPositiveInteger()),
        message: errorMessages.RANGE,
    }),
    [elementTypes.INTEGER_ZERO_OR_POSITIVE_RANGE]: () => ({
        validator: getNumberRangeValidator(validatorForZeroOrPositiveInteger()),
        message: errorMessages.RANGE,
    }),

    [elementTypes.INTEGER_NEGATIVE_RANGE]: () => ({
        validator: getNumberRangeValidator(validatorForNegativeInteger()),
        message: errorMessages.RANGE,
    }),
};

function buildTypeValidators(metaData: MetaDataElement): Array<ValidatorContainer> {
    // $FlowSuppress
    let validatorContainersForType = validatorsForTypes[metaData.type] && validatorsForTypes[metaData.type](metaData);

    if (!validatorContainersForType) {
        return [];
    }

    validatorContainersForType = isArray(validatorContainersForType) ?
        validatorContainersForType :
        [validatorContainersForType]
    ;

    validatorContainersForType = validatorContainersForType
        .map(validatorContainer => ({
            ...validatorContainer,
            type: 'dataType',
        }));

    // $FlowSuppress
    validatorContainersForType = validatorContainersForType.map(validatorContainer => ({
        ...validatorContainer,
        validator: (value: any) => {
            if (!value && value !== 0 && value !== false) {
                return true;
            }

            const toValidateValue = isString(value) ? value.trim() : value;
            return validatorContainer.validator(toValidateValue);
        },
    }));

    return validatorContainersForType;
}

function buildCompulsoryValidator(metaData: MetaDataElement): Array<ValidatorContainer> {
    return metaData.compulsory ? [
        {
            validator: compulsoryValidatorWrapper,
            message:
                errorMessages.COMPULSORY,
        },
    ] :
        [];
}

function buildUniqueValidator(metaData: MetaDataElement) {
    return metaData.unique ? [
        {
            validator: (value: any, contextProps: ?Object) => {
                if (!value && value !== 0 && value !== false) {
                    return true;
                }
                return metaData.unique.onValidate(value, contextProps);
            },
            message: errorMessages.UNIQUENESS,
            validatingMessage: validationMessages.UNIQUENESS,
            type: 'unique',
        },
    ] : [];
}

function compose(validatorBuilders: Array<ValidatorBuilder>, metaData: MetaDataElement) {
    const validators =
        validatorBuilders.reduce((accValidators: Array<ValidatorContainer>, builder: ValidatorBuilder) =>
            [...accValidators, ...builder(metaData)], []);
    return validators;
}

export default function getValidators(metaData: MetaDataElement) {
    const builders = [buildCompulsoryValidator, buildTypeValidators, buildUniqueValidator];
    return compose(builders, metaData);
}
