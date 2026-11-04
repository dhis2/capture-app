/* eslint-disable class-methods-use-this */
import log from 'loglevel';
import type { IConvertOutputRulesEffectsValue } from '@dhis2/rules-engine-javascript';
import { convertValue as convertClientToForm } from '../../converters/clientToForm';
import { dataElementTypes } from '../../metaData';


// These functions are only used for creating assignment effects

export const outputConverter: IConvertOutputRulesEffectsValue = {
    convertText: (value: string): string => value,
    convertMultiText: (value: string): string => [...new Set(value.split(','))].join(','),
    convertLongText: (value: string): string => value,
    convertLetter: (value: string): string => value,
    convertPhoneNumber: (value: string): string => value,
    convertEmail: (value: string): string => value,
    convertBoolean: (value: boolean): string => (value ? 'true' : 'false'),
    convertTrueOnly: (value: boolean): string => (value ? 'true' : 'false'),
    convertDate: (value: string): string => convertClientToForm(value, dataElementTypes.DATE),
    convertDateTime: (value: string): any => convertClientToForm(value, dataElementTypes.DATETIME),
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
    convertAge: (value: string): any => convertClientToForm(value, dataElementTypes.AGE),
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
