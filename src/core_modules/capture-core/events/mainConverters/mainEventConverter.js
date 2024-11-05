// @flow
export function convertMainEvent(
    event: Object,
    keyMap: Object = {},
    onConvert: (key: string, value: any) => any,
    keysToSkip?: {[keyId: string]: string},
) {
    return Object
        .keys(event)
        .reduce((accConvertedEvent, key) => {
            if (keysToSkip && keysToSkip[key]) {
                return accConvertedEvent;
            }
            const convertedValue = onConvert(key, event[key]);
            const outputKey = keyMap[key] || key;
            accConvertedEvent[outputKey] = convertedValue;
            return accConvertedEvent;
        }, {});
}
