// @flow
import isArray from 'd2-utilizr/lib/isArray';
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
import type { DataElement, DateDataElement } from '../../../../metaData';
import { dataElementTypes as elementTypes } from '../../../../metaData';
import { validatorTypes } from './constants';

type Validator = (value: any) => Promise<boolean> | boolean;

type ValidatorContainer = {
    validator: Validator,
    message: string,
    type?: string,
    validatingMessage?: string,
}

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
    const trimmedValue = (value && isString(value)) ? value.trim() : value;
    return hasValue(trimmedValue);
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

// todo (report lgtm)
const validatorsForTypes = {
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.NUMBER]: validatorForNumber,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER]: validatorForInteger,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_POSITIVE]: validatorForPositiveInteger,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: validatorForZeroOrPositiveInteger,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_NEGATIVE]: validatorForNegativeInteger,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.TIME]: () => ({
        validator: isValidTime,
        message: errorMessages.TIME,
    }),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.DATE]: (dateDataElement: DateDataElement) => [{
        validator: isValidDate,
        message: errorMessages.DATE,
    }, {
        validator: (value: string) =>
            (dateDataElement.allowFutureDate ? true : isValidNonFutureDate(value)),
        type: validatorTypes.TYPE_EXTENDED,
        message: errorMessages.DATE_FUTURE_NOT_ALLOWED,
    }],
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.DATETIME]: () => ({
        validator: isValidDateTime,
        message: errorMessages.DATETIME,
    }),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.EMAIL]: () => ({
        validator: isValidEmail,
        message: errorMessages.EMAIL,
    }),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.PERCENTAGE]: () => ({
        validator: isValidPercentage,
        message: errorMessages.PERCENTAGE,
    }),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.URL]: () => ({
        validator: isValidUrl,
        message: errorMessages.URL,
    }),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.AGE]: () => ({
        validator: isValidAge,
        message: errorMessages.AGE,
    }),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.PHONE_NUMBER]: () => ({
        validator: isValidPhoneNumber,
        message: errorMessages.PHONE_NUMBER,
    }),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.ORGANISATION_UNIT]: () => ({
        validator: isValidOrgUnit,
        message: errorMessages.ORGANISATION_UNIT,
    }),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.COORDINATE]: () => ({
        validator: isValidCoordinate,
        message: errorMessages.COORDINATE,
    }),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.DATE_RANGE]: () => ({
        validator: getDateRangeValidator(errorMessages.DATE),
        message: errorMessages.RANGE,
    }),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.DATETIME_RANGE]: () => ({
        validator: getDateTimeRangeValidator(errorMessages.DATETIME),
        message: errorMessages.RANGE,
    }),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.TIME_RANGE]: () => ({
        validator: getTimeRangeValidator(errorMessages.TIME),
        message: errorMessages.RANGE,
    }),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.NUMBER_RANGE]: () => ({
        validator: getNumberRangeValidator(validatorForNumber()),
        message: errorMessages.RANGE,
    }),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_RANGE]: () => ({
        validator: getNumberRangeValidator(validatorForInteger()),
        message: errorMessages.RANGE,
    }),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_POSITIVE_RANGE]: () => ({
        validator: getNumberRangeValidator(validatorForPositiveInteger()),
        message: errorMessages.RANGE,
    }),
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_ZERO_OR_POSITIVE_RANGE]: () => ({
        validator: getNumberRangeValidator(validatorForZeroOrPositiveInteger()),
        message: errorMessages.RANGE,
    }),

    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_NEGATIVE_RANGE]: () => ({
        validator: getNumberRangeValidator(validatorForNegativeInteger()),
        message: errorMessages.RANGE,
    }),
};

function buildTypeValidators(metaData: DataElement): Array<ValidatorContainer> {
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
            type: validatorTypes.TYPE_BASE,
            ...validatorContainer,
        }));


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

function buildCompulsoryValidator(metaData: DataElement): Array<ValidatorContainer> {
    return metaData.compulsory ? [
        {
            validator: compulsoryValidatorWrapper,
            message:
                errorMessages.COMPULSORY,
        },
    ] :
        [];
}

function buildUniqueValidator(metaData: DataElement): Array<ValidatorContainer> {
    return metaData.unique ? [
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
    ] : [];
}

export const getValidators = (metaData: DataElement): Array<ValidatorContainer> => [
    buildCompulsoryValidator,
    buildTypeValidators,
    buildUniqueValidator,
].flatMap(validatorBuilder => validatorBuilder(metaData));
