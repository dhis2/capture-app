// @flow
import elementTypes from '../metaData/DataElement/elementTypes';
import { convertValue as convertToServerValue } from '../converters/clientToServer';
import { convertValue as convertToClientValue } from '../converters/serverToClient';
import eventStatusElement from './eventStatusElement';

type ConverterFn = (type: $Values<typeof elementTypes>, value: any) => any;

type InputCompareKeys = {
    eventDate?: ?string,
    dueDate?: ?string,
    completedDate?: ?string,
    status?: ?string,
    assignee?: ?string,
};

type CompareKeys = {
    eventDate: string,
    dueDate: string,
    completedDate: string,
    status: string,
    assignee: string,
};

// eslint-disable-next-line complexity
function getConvertedValue(valueToConvert: any, key: string, onConvertValue: ConverterFn, compareKeys: CompareKeys) {
    let convertedValue;

    switch (key) {
    case compareKeys.eventDate:
    case compareKeys.dueDate:
    case compareKeys.completedDate:
        convertedValue = onConvertValue(valueToConvert, elementTypes.DATE);
        break;
    case compareKeys.status:
        convertedValue = onConvertValue(valueToConvert, elementTypes.TEXT, eventStatusElement);
        break;
    case compareKeys.assignee:
        convertedValue = valueToConvert.id;
        break;
    default:
        convertedValue = valueToConvert;
        break;
    }

    return convertedValue;
}


// eslint-disable-next-line complexity
function getCalculatedCompareKeys(compareKeysMapFromDefault: InputCompareKeys) {
    return {
        eventDate: compareKeysMapFromDefault.eventDate || 'eventDate',
        dueDate: compareKeysMapFromDefault.dueDate || 'dueDate',
        completedDate: compareKeysMapFromDefault.completedDate || 'completedDate',
        status: compareKeysMapFromDefault.status || 'status',
        assignee: compareKeysMapFromDefault.assignee || 'assignee',
    };
};

export function convertMainEvent(
    event: Object,
    onConvertValue: ConverterFn,
    keyMap: Object = {},
    compareKeysMapFromDefault: InputCompareKeys = {}) {
    const calculatedCompareKeys = getCalculatedCompareKeys(compareKeysMapFromDefault);

    return Object
        .keys(event)
        .reduce((accConvertedEvent, key) => {
            const convertedValue = getConvertedValue(event[key], key, onConvertValue, calculatedCompareKeys);
            const outputKey = keyMap[key] || key;
            accConvertedEvent[outputKey] = convertedValue;
            return accConvertedEvent;
        }, {});
}

const mapEventClientKeyToServerKey = {
    eventId: 'event',
    programId: 'program',
    programStageId: 'programStage',
    orgUnitId: 'orgUnit',
    trackedEntityInstanceId: 'trackedEntityInstance',
    enrollmentId: 'enrollment',
    assignee: 'assignedUser',
};

export function convertMainEventClientToServerWithKeysMap(event: Object) {
    return convertMainEvent(event, convertToServerValue, mapEventClientKeyToServerKey);
}

const mapEventServerKeyToClientKey = {
    event: 'eventId',
    program: 'programId',
    programStage: 'programStageId',
    orgUnit: 'orgUnitId',
    trackedEntityInstance: 'trackedEntityInstanceId',
    enrollment: 'enrollmentId',
    assignedUser: 'assignee',
};

export function convertMainEventServerToClientWithKeysMap(event: Object) {
    return convertMainEvent(event, convertToClientValue, mapEventServerKeyToClientKey);
}
