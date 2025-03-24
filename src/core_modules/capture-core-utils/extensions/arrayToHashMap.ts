declare global {
    interface Array<T extends Record<string, any>> {
        toHashMap(key: keyof T): Record<string, T>;
    }
}

Object.defineProperty(Array.prototype, 'toHashMap', {
    enumerable: false,
    value: function<T extends Record<string, any>>(
        this: T[],
        key: keyof T
    ): Record<string, T> {
        return this.reduce((accObjects, item) => {
            accObjects[String(item[key])] = item;
            return accObjects;
        }, {} as Record<string, T>);
    },
});

export {};