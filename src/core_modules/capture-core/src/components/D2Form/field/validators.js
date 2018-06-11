// @flow
import { Validators } from '@dhis2/d2-ui-forms';
import isArray from 'd2-utilizr/src/isArray';
import isString from 'd2-utilizr/src/isString';

import isValidDate from '../../../utils/validators/date.validator';
import isValidDateTime from '../../../utils/validators/dateTime.validator';
import isValidTime from '../../../utils/validators/time.validator';
import i18n from '@dhis2/d2-i18n';
import MetaDataElement from '../../../metaData/DataElement/DataElement';
import elementTypes from '../../../metaData/DataElement/elementTypes';

type Validator = (value: any) => boolean;

type ValidatorContainer = {
    validator: Validator,
    message: string
}

type ValidatorBuilder = (metaData: MetaDataElement) => Array<ValidatorContainer>;

const wordValidatorKeys = {
    COMPULSORY: 'required',
    NUMBER: 'number',
    POSITIVE_NUMBER: 'positive_number',
    EMAIL: 'email',
};

const errorMessages = {
    INTEGER: 'Please provide a valid integer',
    POSITIVE_INTEGER: 'Please provide a positive integer',
    ZERO_OR_POSITIVE_INTEGER: 'Please provide zero or a positive integer',
    DATE: 'Please provide a valid date',
    DATETIME: 'Please provide a valid date and time',
    TIME: 'Please provide a valid time',
    PERCENTAGE: 'Please provide a valid percentage',
};

const isCompulsoryRequirementMet = Validators.wordToValidatorMap.get(wordValidatorKeys.COMPULSORY);

const isCompulsoryRequirementMetWrapper = (value: any) => {
    const testValue = (value && isString(value)) ? value.trim() : value;
    return isCompulsoryRequirementMet(testValue);
};

const isInteger = (value: string) => {
    const isValidNumberFn = Validators.wordToValidatorMap.get(wordValidatorKeys.NUMBER);
    if (!isValidNumberFn(value)) {
        return false;
    }

    const number = Number(value);
    return Number.isSafeInteger(number);
};

const isPositiveInteger = (value: string) => {
    const isValidPositiveNumberFn = Validators.wordToValidatorMap.get(wordValidatorKeys.POSITIVE_NUMBER);
    if (!isValidPositiveNumberFn(value)) {
        return false;
    }

    const number = Number(value);
    return Number.isSafeInteger(number);
};

const isZeroOrPositiveInteger = (value: any) => {
    if (value === 0) {
        return true;
    }
    return isPositiveInteger(value);
};

const isValidPercentage = (value: any) => {
    const replacedValue = value.replace('%', '');
    const numberValidator = Validators.wordToValidatorMap.get(wordValidatorKeys.NUMBER);
    return numberValidator(replacedValue);
};

const validatorsForTypes = {
    [elementTypes.NUMBER]: () => ({
        validator: Validators.wordToValidatorMap.get(wordValidatorKeys.NUMBER),
        message:
            i18n.t(Validators.wordToValidatorMap.get(wordValidatorKeys.NUMBER).message),
    }),
    [elementTypes.INTEGER]: () => ({
        validator: isInteger,
        message: i18n.t(errorMessages.INTEGER),
    }),
    [elementTypes.INTEGER_POSITIVE]: () => ({
        validator: isPositiveInteger,
        message: i18n.t(errorMessages.POSITIVE_INTEGER),
    }),
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: () => ({
        validator: isZeroOrPositiveInteger,
        message: i18n.t(errorMessages.ZERO_OR_POSITIVE_INTEGER),
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
        validator: Validators.wordToValidatorMap.get(wordValidatorKeys.EMAIL),
        message: i18n.t(Validators.wordToValidatorMap.get(wordValidatorKeys.EMAIL).message),
    }),
    [elementTypes.PERCENTAGE]: () => ({
        validator: isValidPercentage,
        message: i18n.t(errorMessages.PERCENTAGE),
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
            validator: isCompulsoryRequirementMetWrapper,
            message:
                i18n.t(
                    Validators.wordToValidatorMap.get(
                        wordValidatorKeys.COMPULSORY,
                    ).message
                ),
        },
    ] :
        [];
}

function compose(validatorBuilders: Array<ValidatorBuilder>, metaData: MetaDataElement) {
    const validators =
        validatorBuilders.reduce((accValidators: Array<ValidatorContainer>, builder: ValidatorBuilder) =>
            [...accValidators, ...builder(metaData)], []);
    return validators;
}

export default function getValidators(metaData: MetaDataElement) {
    const builders = [buildCompulsoryValidator, buildTypeValidators];
    return compose(builders, metaData);
}
