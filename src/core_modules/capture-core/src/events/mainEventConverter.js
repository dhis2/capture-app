// @flow
import elementTypes from '../metaData/DataElement/elementTypes';

type ConverterFn = (type: $Values<typeof elementTypes>, value: any) => any;

function getConvertedValue(valueToConvert: any, key: string, onConvertValue: ConverterFn) {
    let convertedValue;
    if (key === 'eventDate' || key === 'dueDate' || key === 'completedDate') {
        convertedValue = onConvertValue(elementTypes.DATE, valueToConvert);
    } else {
        convertedValue = valueToConvert;
    }
    return convertedValue;
}

export function convertMainEvent(event: Event, onConvertValue: ConverterFn) {
    return Object
        .keys(event)
        .reduce((accConvertedEvent, key) => {
            accConvertedEvent[key] = getConvertedValue(event[key], key, onConvertValue);
            return accConvertedEvent;
        }, {});
}

export function convertMainEvents(events: Array<Event>, onConvertValue: ConverterFn) {
    // $FlowSuppress
    return events
        .map(event => convertMainEvent(event, onConvertValue));
}
