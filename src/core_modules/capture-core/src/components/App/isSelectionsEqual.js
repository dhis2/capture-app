// @flow
/*
    The first argument must be a complete selections set
    TODO: add category combos
*/

const CATEGORIES = 'categories';

const isSelectionsEqual = (completeSet1: Object, set2: Object) =>
    Object
        .keys(completeSet1)
        .every((key) => {
            const value1 = completeSet1[key];
            const value2 = set2[key];

            if (key === CATEGORIES) {
                const isCategoriesEqual = isSelectionsEqual(completeSet1.categories, set2.categories);
                return isCategoriesEqual;
            }

            return value1 === value2;
        });

export default isSelectionsEqual;
