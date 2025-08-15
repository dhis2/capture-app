export function convertMainEvent(
    event: any,
    onConvert: (key: string, value: any) => any,
    keysToSkip?: {[keyId: string]: string},
    keyMap: any = {},
) {
    return Object
        .keys(event)
        .reduce((accConvertedEvent, key) => {
            if (keysToSkip?.[key]) {
                return accConvertedEvent;
            }
            const convertedValue = onConvert(key, event[key]);
            const outputKey = keyMap[key] || key;
            accConvertedEvent[outputKey] = convertedValue;
            return accConvertedEvent;
        }, {});
}
