export class IndexedDBError extends Error {
    error: Record<string, unknown>;

    constructor(error: Record<string, unknown>) {
        super(error.message as string);
        this.error = error;
    }
} 