// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function hasValue(value: any, _internalComponentError?: {error?: string, errorCode?: string}) {
    return (Boolean(value) || value === 0 || value === false);
}
