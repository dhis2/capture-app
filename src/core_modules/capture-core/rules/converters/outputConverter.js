// @flow
/* eslint-disable class-methods-use-this */
import log from 'loglevel';
import moment from 'moment';
import type { IConvertOutputRulesEffectsValue } from '@dhis2/rules-engine-javascript';
import { convertMomentToDateFormatString } from '../../utils/converters/date';


// These functions are only used for creating assignment effects

const dateMomentFormat = 'YYYY-MM-DD';

export const outputConverter: IConvertOutputRulesEffectsValue = {
    convertText: (value: string): string => value,
    convertMultiText: (value: string): string => [...new Set(value.split(','))].join(','),
    convertLongText: (value: string): string => value,
    convertLetter: (value: string): string => value,
    convertPhoneNumber: (value: string): string => value,
    convertEmail: (value: string): string => value,
    convertBoolean: (value: boolean): string => (value ? 'true' : 'false'),
    convertTrueOnly: (value: boolean): string => (value ? 'true' : 'false'),
    convertDate: (value: string): string => {
        const momentDate = moment(value, dateMomentFormat);
        return convertMomentToDateFormatString(momentDate);
    },
    convertDateTime: (value: string): ?Object => {
        const momentDateTime = moment(value);
        return {
            date: convertMomentToDateFormatString(momentDateTime),
            time: momentDateTime.format('HH:mm'),
        };
    },
    convertTime: (value: string): string => value,
    convertNumber: (value: number): string => (value.toString()),
    convertUnitInterval: (value: number): string => (value.toString()),
    convertPercentage: (value: number): string => (value.toString()),
    convertInteger: (value: number): string => (value.toString()),
    convertIntegerPositive: (value: number): string => (value.toString()),
    convertIntegerNegative: (value: number): string => (value.toString()),
    convertIntegerZeroOrPositive: (value: number): string => (value.toString()),
    convertTrackerAssociate: (value: string): any => {
        log.warn('convertTrackerAssociate not implemented', value);
        return '';
    },
    convertUserName: (value: string): any => {
        log.warn('convertUserName not implemented', value);
        return '';
    },
    convertCoordinate: (value: string): any => {
        const trimmedValue = value.trim();
        const coordinates = trimmedValue.substring(1, trimmedValue.length - 1).split(',');
        return {
            latitude: Number(coordinates[0]),
            longitude: Number(coordinates[1]),
        };
    },
    convertOrganisationUnit: (value: string): any => {
        log.warn('convertOrganisationUnit not implemented', value);
        return '';
    },
    convertAge: (value: string): Object => {
        const now = moment();
        const age = moment(value, dateMomentFormat);

        const years = now.diff(age, 'years');
        age.add(years, 'years');

        const months = now.diff(age, 'months');
        age.add(months, 'months');

        const days = now.diff(age, 'days');

        return {
            date: convertMomentToDateFormatString(moment(value, dateMomentFormat)),
            years: years.toString(),
            months: months.toString(),
            days: days.toString(),
        };
    },
    convertUrl: (value: string): string => value,
    convertFile: (value: string): any => {
        log.warn('convertFile not implemented', value);
        return '';
    },
    convertImage: (value: string): any => {
        log.warn('convertImage not implemented', value);
        return '';
    },
};
