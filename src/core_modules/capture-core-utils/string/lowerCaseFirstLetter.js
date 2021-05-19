// @flow
export function lowerCaseFirstLetter(text: string) {
    const first = text.charAt(0).toLocaleLowerCase();
    const rest = text.slice(1);
    return first + rest;
}
