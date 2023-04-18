export class IndexedDBError extends Error {
    constructor(error) {
        super(error.message);
        this.error = error;
    }
}
