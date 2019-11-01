// @flow
export default function parseNumber(stringValue: string) {
    stringValue = stringValue.replace(/[ ]/g, '');
    stringValue = stringValue.replace(',', '.');
    stringValue = stringValue.replace(/^[+]$/, '');
    const value = Number(stringValue);
    return value;
}
