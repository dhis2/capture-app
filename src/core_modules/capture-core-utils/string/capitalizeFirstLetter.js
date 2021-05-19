// @flow
export function capitalizeFirstLetter(text: string) {
    const first = text.charAt(0).toLocaleUpperCase();
    const rest = text.slice(1);
    return first + rest;
}
