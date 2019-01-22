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
    COMPULSORY: 'A value is required',
    NUMBER: 'Please provide a valid number',
    INTEGER: 'Please provide a valid integer',
    POSITIVE_INTEGER: 'Please provide a positive integer',
    ZERO_OR_POSITIVE_INTEGER: 'Please provide zero or a positive integer',
    NEGATIVE_INTEGER: 'Please provide a negative integer',
    DATE: 'Please provide a valid date',
    DATETIME: 'Please provide a valid date and time',
    TIME: 'Please provide a valid time',
    PERCENTAGE: 'Please provide a valid percentage',
    URL: 'Please provide a valid url',
    EMAIL: 'Please provide a valid email address',
    AGE: 'Please provide a valid age',
    PHONE_NUMBER: 'Please provide a valid phone number',
    ORGANISATION_UNIT: 'Please provide a valid organisation unit',
    COORDINATE: 'Please provide valid coordinates',
    USERNAME: 'Please provide a valid username',
    UNIQUENESS: 'This value already exists',
};

const validationMessages = {
    UNIQUENESS: 'This value is validating uniqueness',
};

const compulsoryValidator = Validators.wordToValidatorMap.get(wordValidatorKeys.COMPULSORY);

const compulsoryValidatorWrapper = (value: any) => {
    const testValue = (value && isString(value)) ? value.trim() : value;
    return compulsoryValidator(testValue);
};

const validatorForInteger = () => ({
    validator: isValidInteger,
    message: i18n.t(errorMessages.INTEGER),
});

const validatorForNumber = () => ({
    validator: isValidNumber,
    message: i18n.t(errorMessages.NUMBER),
});

const validatorsForTypes = {
    [elementTypes.NUMBER]: validatorForNumber,
    [elementTypes.INTEGER]: validatorForInteger,
    [elementTypes.INTEGER_POSITIVE]: () => ({
        validator: isValidPositiveInteger,
        message: i18n.t(errorMessages.POSITIVE_INTEGER),
    }),
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: () => ({
        validator: isValidZeroOrPositiveInteger,
        message: i18n.t(errorMessages.ZERO_OR_POSITIVE_INTEGER),
    }),
    [elementTypes.INTEGER_NEGATIVE]: () => ({
        validator: isValidNegativeInteger,
        message: i18n.t(errorMessages.NEGATIVE_INTEGER),
    }),
    [elementTypes.TIME]: () => ({
        validator: isValidTime,
        message: i18n.t(errorMessages.TIME),
    }),
    [elementTypes.DATE]: () => ({
        validator: isValidDate,
        message: i18n.t(errorMessages.DATE),
    }),
    [elementTypes.DATETIME]: () => ({
        validator: isValidDateTime,
        message: i18n.t(errorMessages.DATETIME),
    }),
    [elementTypes.EMAIL]: () => ({
        validator: isValidEmail,
        message: i18n.t(errorMessages.EMAIL),
    }),
    [elementTypes.PERCENTAGE]: () => ({
        validator: isValidPercentage,
        message: i18n.t(errorMessages.PERCENTAGE),
    }),
    [elementTypes.URL]: () => ({
        validator: isValidUrl,
        message: i18n.t(errorMessages.URL),
    }),
    [elementTypes.AGE]: () => ({
        validator: isValidAge,
        message: i18n.t(errorMessages.AGE),
    }),
    [elementTypes.PHONE_NUMBER]: () => ({
        validator: isValidPhoneNumber,
        message: i18n.t(errorMessages.PHONE_NUMBER),
    }),
    [elementTypes.ORGANISATION_UNIT]: () => ({
        validator: isValidOrgUnit,
        message: i18n.t(errorMessages.ORGANISATION_UNIT),
    }),
    [elementTypes.COORDINATE]: () => ({
        validator: isValidCoordinate,
        message: i18n.t(errorMessages.COORDINATE),
    }),
    [elementTypes.USERNAME]: () => ({
        validator: isValidUsername,
        message: i18n.t(errorMessages.USERNAME),
    }),
    [elementTypes.NUMBER_RANGE]: () => ({
        validator: getNumberRangeValidator(validatorForNumber()),
        message: i18n.t('Invalid range'),
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
                i18n.t(errorMessages.COMPULSORY),
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
            message: i18n.t(errorMessages.UNIQUENESS),
            validatingMessage: i18n.t(validationMessages.UNIQUENESS),
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
