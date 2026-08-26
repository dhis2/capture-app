export const errorCreator = (message: string) => (details?: any) => ({
    ...details,
    message,
});
