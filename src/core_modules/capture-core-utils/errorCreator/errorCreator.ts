type ErrorDetails = Record<string, unknown>;

export const errorCreator = (message: string) => (details?: ErrorDetails): ErrorDetails => ({
    ...details,
    message,
}); 