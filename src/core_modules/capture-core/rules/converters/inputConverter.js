// @flow
/* eslint-disable class-methods-use-this */
import log from 'loglevel';
import moment from 'moment';
import type { IConvertInputRulesValue } from 'capture-core-utils/rulesEngine/rulesEngine.types';

const dateMomentFormat = 'YYYY-MM-DD';

export const inputConverter: IConvertInputRulesValue = {
    convertText: (value: ?string): ?string => (value || null),
    convertLongText: (value: ?string): ?string => (value || null),
    convertLetter: (value: ?string): ?string => (value || null),
    convertPhoneNumber: (value: ?string): ?string => (value || null),
    convertEmail: (value: ?string): ?string => (value || null),
    convertBoolean: (value: ?boolean): ?boolean => ((value || value === false) ? value : null),
    convertTrueOnly: (value: ?boolean): ?boolean => ((value || value === false) ? value : null),
    convertDate: (value: any): ?string => {
        if (!value) {
            return null;
        }
        const momentObject = moment(value);
        momentObject.locale('en');
        return momentObject.format(dateMomentFormat);
    },
    convertDateTime: (value: ?string): ?string => (value || null),
    convertTime: (value: ?string): ?string => (value || null),
    convertNumber: (value: any): ?number => (typeof value === 'number' ? value : null),
    convertUnitInterval: (value: any): ?number => (typeof value === 'number' ? value : null),
    convertPercentage: (value: any): ?number => (typeof value === 'number' ? value : null),
    convertInteger: (value: any): ?number => (typeof value === 'number' ? value : null),
    convertIntegerPositive: (value: any): ?number => (typeof value === 'number' ? value : null),
    convertIntegerNegative: (value: any): ?number => (typeof value === 'number' ? value : null),
    convertIntegerZeroOrPositive: (value: any): ?number => (typeof value === 'number' ? value : null),
    convertTrackerAssociate: (value: any): ?string => {
        log.warn('convertTrackerAssociate not implemented', value);
        return null;
    },
    convertUserName: (value: any): ?string => {
        log.warn('convertUserName not implemented', value);
        return null;
    },
    convertCoordinate: (value: any): ?string => {
        log.warn('convertCoordinate not implemented', value);
        return null;
    },
    convertOrganisationUnit: (value: any): ?string => {
        log.warn('convertOrganisationUnit not implemented', value);
        return null;
    },
    convertAge: (value: any): ?string => inputConverter.convertDate(value),
    convertUrl: (value: ?string): ?string => (value || null),
    convertFile(value: any): ?string {
        log.warn('convertFile not implemented', value);
        return null;
    },
    convertImage(value: any): ?string {
        log.warn('convertImage not implemented', value);
        return null;
    },
};
