/* eslint-disable class-methods-use-this */
import log from 'loglevel';
import moment from 'moment';
import type { IConvertInputRulesValue } from '@dhis2/rules-engine-javascript';

const dateMomentFormat = 'YYYY-MM-DD';

const convertStringValue = (value: string | null): string | null => (value || null);
const convertNumericValue = (value: any): number | null => (typeof value === 'number' ? value : null);
const convertObjectToString = (value: { name: string } | null) => (value ? value.name : null);

export const inputConverter: IConvertInputRulesValue = {
    convertText: convertStringValue,
    convertMultiText: convertStringValue,
    convertLongText: convertStringValue,
    convertLetter: convertStringValue,
    convertPhoneNumber: convertStringValue,
    convertEmail: convertStringValue,
    convertBoolean: (value: boolean | null): boolean | null => ((value || value === false) ? value : null),
    convertTrueOnly: (value: boolean | null): boolean | null => (value || null),
    convertDate: (value: any): string | null => {
        if (!value) {
            return null;
        }
        const momentObject = moment(value);
        momentObject.locale('en');
        return momentObject.format(dateMomentFormat);
    },
    convertDateTime: convertStringValue,
    convertTime: convertStringValue,
    convertNumber: convertNumericValue,
    convertUnitInterval: convertNumericValue,
    convertPercentage: convertNumericValue,
    convertInteger: convertNumericValue,
    convertIntegerPositive: convertNumericValue,
    convertIntegerNegative: convertNumericValue,
    convertIntegerZeroOrPositive: convertNumericValue,
    convertTrackerAssociate: (value: any): string | null => {
        log.warn('convertTrackerAssociate not implemented', value);
        return null;
    },
    convertUserName: convertStringValue,
    convertCoordinate: (value: any): string | null => (
        (value && value.latitude && value.longitude) ? `[${value.latitude},${value.longitude}]` : null),
    convertOrganisationUnit: convertObjectToString,
    convertAge: (value: any): string | null => inputConverter.convertDate(value),
    convertUrl: convertStringValue,
    convertFile: convertObjectToString,
    convertImage: convertObjectToString,
};
