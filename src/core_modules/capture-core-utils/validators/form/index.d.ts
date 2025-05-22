declare module 'capture-core-utils/validators/form' {
    export function hasValue(value: any): boolean;
    export function isValidEmail(value: string): boolean;
    export function isValidInteger(value: string): boolean;
    export function isValidPositiveInteger(value: string): boolean;
    export function isValidNegativeInteger(value: string): boolean;
    export function isValidZeroOrPositiveInteger(value: string): boolean;
    export function isValidNumber(value: string): boolean;
    export function isValidPercentage(value: string): boolean;
    export function isValidTime(value: string): boolean;
    export function isValidUrl(value: string): boolean;
    export function isValidPhoneNumber(value: string): boolean;
    export function isValidOrgUnit(value: any): boolean;
    export function isValidCoordinate(value: any): boolean;
}
