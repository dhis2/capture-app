// @flow
export function convertMainEvent(
  event: Object,
  keyMap: Object = {},
  onConvert: (key: string, value: any) => any,
) {
  return Object.keys(event).reduce((accConvertedEvent, key) => {
    const convertedValue = onConvert(key, event[key]);
    const outputKey = keyMap[key] || key;
    accConvertedEvent[outputKey] = convertedValue;
    return accConvertedEvent;
  }, {});
}
