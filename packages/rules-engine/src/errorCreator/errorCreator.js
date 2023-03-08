// @flow
export const errorCreator = (message: string) => (details?: ?Object) => ({
    ...details,
    message,
});
