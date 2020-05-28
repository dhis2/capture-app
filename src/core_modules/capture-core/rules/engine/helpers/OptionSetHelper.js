export default class OptionSetHelper {
    static getCode(options, key) {
        if (options) {
            const option = options.find(o => o.displayName === key);
            return (option && option.code) || key;
        }
        return key;
    }

    static getName(options, key) {
        if (options) {
            const option = options.find(o => o.code === key);
            return (option && option.displayName) || key;
        }
        return key;
    }
}
