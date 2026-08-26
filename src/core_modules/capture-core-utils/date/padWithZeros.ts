/**
 * Pads a string or number with zeros at the start to reach a minimum length
 * @export
 * @param {string|number} value - the value to pad
 * @param {number} length - length required
 * @returns {string}
 */
export function padWithZeros(value: string | number, length: number): string {
    return String(value).padStart(length, '0');
}
