export class IndexedDBError extends Error {
    error: any;

    constructor(error: any) {
        super(error.message);
        this.error = error;
    }
}
