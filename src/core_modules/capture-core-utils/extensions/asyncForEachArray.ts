declare global {
    interface Array<T> {
        asyncForEach(
            callback: (value: T, index: number, array: T[]) => Promise<void>
        ): Promise<void>;
    }
}

Object.defineProperty(Array.prototype, 'asyncForEach', {
    enumerable: false,
    value: async function<T>(
        this: T[],
        callback: (value: T, index: number, array: T[]) => Promise<void>
    ): Promise<void> {
        for (let index = 0; index < this.length; index++) {
            await callback(this[index], index, this);
        }
    },
});

export {};
