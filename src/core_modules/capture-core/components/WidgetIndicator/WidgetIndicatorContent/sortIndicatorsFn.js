// eslint-disable-next-line complexity
export const sortIndicatorsFn = (a, b) => {
    if (typeof b === 'string') {
        return (((a.key && a.key.localeCompare(b)) || (a.message && a.message.localeCompare(b))));
    }
    if (b.message) {
        return (((a.key && a.key.localeCompare(b.message)) || (a.message && a.message.localeCompare(b.message))));
    }
    if (b.key) {
        return (((a.key && a.key.localeCompare(b.key)) || (a.message && a.message.localeCompare(b.key))));
    }
    return 1;
};
