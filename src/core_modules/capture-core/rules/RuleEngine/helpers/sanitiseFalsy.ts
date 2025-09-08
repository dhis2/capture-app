export const sanitiseFalsy = (value: any) => {
    if (value) {
        return value;
    }
    if (value === 0) {
        return 0;
    }
    return '';
};
