// @flow

Object.defineProperty(Array.prototype, 'asyncForEach', {
    enumerable: false,
    value: async function(callback, a, b) {
        for (let index = 0; index < this.length; index++) {
            await callback(this[index], index, this);
        }
    },
});
