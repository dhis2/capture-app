// @flow

const CATEGORIES_KEY = 'categories';
const COMPLETE_KEY = 'complete';

const isSelectionsEqual = (set1: Object, set2: Object) => {
    const set1Keys = Object
        .keys(set1)
        .filter(key =>
            key !== COMPLETE_KEY && set1[key] && (typeof set1[key] !== 'object' || Object.keys(set1[key]).length > 0));

    const set2Keys = Object
        .keys(set2)
        .filter(key =>
            key !== COMPLETE_KEY && set2[key] && (typeof set2[key] !== 'object' || Object.keys(set2[key]).length > 0));

    if (set1Keys.length !== set2Keys.length) {
        return false;
    }

    return set1Keys
        .every((key) => {
            const value1 = set1[key];
            const value2 = set2[key];

            if (key === CATEGORIES_KEY) {
                return isSelectionsEqual(set1.categories, set2.categories);
            }

            return value1 === value2;
        });
};

export default isSelectionsEqual;
