// @flow
import { dataElementTypes } from '../../metaData';
import { eventStatusElement } from '../eventStatusElement';

type ConverterFn = (type: $Keys<typeof dataElementTypes>, value: any) => any;

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
        convertedValue = onConvertValue(valueToConvert, dataElementTypes.DATE);
        break;
    case compareKeys.status:
        // $FlowFixMe[extra-arg] automated comment
        convertedValue = onConvertValue(valueToConvert, dataElementTypes.TEXT, eventStatusElement);
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
}

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
