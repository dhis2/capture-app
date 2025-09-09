import moment from 'moment';
import { parseNumber, parseTime } from 'capture-core-utils/parsers';
import { dataElementTypes } from '../metaData';
import type { ApiAssignedUser } from '../../capture-core-utils/types/api-types';

function convertTime(d2Value: string) {
    const parseData = parseTime(d2Value);
    if (!parseData.isValid) {
        return null;
    }
    return parseData.momentTime;
}

const convertAssignedUserToClient = (assignedUser?: ApiAssignedUser) =>
    ((assignedUser && assignedUser.uid) ? {
        id: assignedUser.uid,
        name: assignedUser.displayName || `${assignedUser.firstName} ${assignedUser.surname}`,
        username: assignedUser.username,
        firstName: assignedUser.firstName,
        surname: assignedUser.surname,
    } : null);

const optionSetConvertersForType = {
    [dataElementTypes.NUMBER]: parseNumber,
    [dataElementTypes.INTEGER]: parseNumber,
    [dataElementTypes.INTEGER_POSITIVE]: parseNumber,
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: parseNumber,
    [dataElementTypes.INTEGER_NEGATIVE]: parseNumber,
    [dataElementTypes.PERCENTAGE]: parseNumber,
    [dataElementTypes.DATE]: (d2Value: string) => moment(d2Value, 'YYYY-MM-DD').toISOString(),
    [dataElementTypes.DATETIME]: (d2Value: string) => moment(d2Value, 'YYYY-MM-DD HH:mm').toISOString(),
    [dataElementTypes.TIME]: convertTime,
    [dataElementTypes.TRUE_ONLY]: (d2Value: string) => ((d2Value === 'true') || null),
    [dataElementTypes.BOOLEAN]: (d2Value: string) => (d2Value === 'true'),
};

export function convertOptionSetValue(value: any, type: keyof typeof dataElementTypes) {
    if (value == null) {
        return null;
    }

    return optionSetConvertersForType[type] ? optionSetConvertersForType[type](value) : value;
}

function convertCoordinateToClient(value: any) {
    const coordinates = typeof value === 'string' ?
        value.replace(/[\(\)\[\]\s]/g, '').split(',').map(Number) : value;

    return { latitude: coordinates[1], longitude: coordinates[0] };
}

function convertPolygonToClient(value: any) {
    if (typeof value === 'string') {
        const coordinates = value.replace(/[()]/g, '').split(',').map(Number);
        const coordinatesArray: number[][] = [];
        for (let i = 0; i < coordinates.length; i += 2) {
            coordinatesArray.push([coordinates[i], coordinates[i + 1]]);
        }
        return coordinatesArray;
    }
    return value;
}

const valueConvertersForType = {
    [dataElementTypes.NUMBER]: parseNumber,
    [dataElementTypes.INTEGER]: parseNumber,
    [dataElementTypes.INTEGER_POSITIVE]: parseNumber,
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: parseNumber,
    [dataElementTypes.INTEGER_NEGATIVE]: parseNumber,
    [dataElementTypes.PERCENTAGE]: parseNumber,
    [dataElementTypes.DATE]: (d2Value: string) => moment(d2Value, 'YYYY-MM-DD').toISOString(),
    [dataElementTypes.DATETIME]: (d2Value: string) => moment(d2Value).toISOString(),
    [dataElementTypes.TRUE_ONLY]: (d2Value: string) => ((d2Value === 'true') || null),
    [dataElementTypes.BOOLEAN]: (d2Value: string) => (d2Value === 'true'),
    [dataElementTypes.COORDINATE]: (d2Value: string | Array<string>) => convertCoordinateToClient(d2Value),
    [dataElementTypes.POLYGON]: (d2Value: string | Array<Array<number>>) => convertPolygonToClient(d2Value),
    [dataElementTypes.ASSIGNEE]: convertAssignedUserToClient,
};

export function convertValue(value: any, type: keyof typeof dataElementTypes) {
    if (value == null) {
        return null;
    }

    return valueConvertersForType[type] ? valueConvertersForType[type](value) : value;
}
