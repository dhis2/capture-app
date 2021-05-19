// @flow

class InMemoryFileStore {
    fileUrls: { [string]: string };

    constructor() {
        this.fileUrls = {};
    }

    get = (fileId: string) => this.fileUrls[fileId];

    set = (fileId: string, file: File) => {
        this.fileUrls[fileId] = URL.createObjectURL(file);
    }

    clear = () => {
        this.fileUrls = Object.keys(this.fileUrls).reduce((accFileUrls, fileId) => {
            URL.revokeObjectURL(this.fileUrls[fileId]);
            return accFileUrls;
        }, {});
    }
}

export const inMemoryFileStore = new InMemoryFileStore();
