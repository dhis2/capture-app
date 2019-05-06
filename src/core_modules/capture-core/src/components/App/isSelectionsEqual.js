// @flow
/*
    The first argument must be a complete selections set
*/

const CATEGORIES_KEY = 'categories';
const COMPLETE_KEY = 'complete';

const isSelectionsEqual = (completeSet1: Object, set2: Object) =>
    Object
        .keys(completeSet1)
        .filter(key => key !== COMPLETE_KEY && completeSet1[key] != null)
        .every((key) => {
            const value1 = completeSet1[key];
            const value2 = set2[key];

            if (key === CATEGORIES_KEY) {
                const isCategoriesEqual = isSelectionsEqual(completeSet1.categories, set2.categories);
                return isCategoriesEqual;
            }

            return value1 === value2;
        });

export default isSelectionsEqual;
