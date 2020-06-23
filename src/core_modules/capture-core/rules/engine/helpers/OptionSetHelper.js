export default class OptionSetHelper {
    static getName(options, key) {
        if (options) {
            const option = options.find(o => o.code === key);
            return (option && option.displayName) || key;
        }
        return key;
    }
}
