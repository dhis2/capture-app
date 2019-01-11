// @flow
import elementTypes from '../metaData/DataElement/elementTypes';
import { convertValue as convertToServerValue } from '../converters/clientToServer';
import { convertValue as convertToClientValue } from '../converters/serverToClient';

type ConverterFn = (type: $Values<typeof elementTypes>, value: any) => any;

type InputCompareKeys = {
    eventDate?: ?string,
    dueDate?: ?string,
    completedDate?: ?string,
};

type CompareKeys = {
    eventDate: string,
    dueDate: string,
    completedDate: string,
};

function getConvertedValue(valueToConvert: any, key: string, onConvertValue: ConverterFn, compareKeys: CompareKeys) {
    let convertedValue;
    if (key === compareKeys.eventDate || key === compareKeys.dueDate || key === compareKeys.completedDate) {
        convertedValue = onConvertValue(valueToConvert, elementTypes.DATE);
    } else {
        convertedValue = valueToConvert;
    }
    return convertedValue;
}

export function convertMainEvent(
    event: Object,
    onConvertValue: ConverterFn,
    keyMap: Object = {},
    compareKeysMapFromDefault: InputCompareKeys = {}) {
    const calculatedCompareKeys: CompareKeys = {
        eventDate: compareKeysMapFromDefault.eventDate || 'eventDate',
        dueDate: compareKeysMapFromDefault.dueDate || 'dueDate',
        completedDate: compareKeysMapFromDefault.completedDate || 'completedDate',
    };

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
};

export function convertMainEventServerToClientWithKeysMap(event: Object) {
    return convertMainEvent(event, convertToClientValue, mapEventServerKeyToClientKey);
}
