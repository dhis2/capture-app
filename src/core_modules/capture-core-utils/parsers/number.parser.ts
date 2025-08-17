export function parseNumber(stringValue: string): number | null {
    stringValue = stringValue.replace(/[ ]/g, '');
    stringValue = stringValue.replace(',', '.');
    stringValue = stringValue.replace(/^[+]$/, '');
    const value = Number(stringValue);
    return isNaN(value) ? null : value;
}
