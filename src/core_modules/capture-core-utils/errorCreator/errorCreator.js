// @flow
export default (message: string) => (details?: ?Object) => ({
    ...details,
    message,
});
