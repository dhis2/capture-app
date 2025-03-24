export function DisplayException(message: string, innerError: unknown) {
    return {
        message,
        innerError,
        toString: () => message
    };
}
