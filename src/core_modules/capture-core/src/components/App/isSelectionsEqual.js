// @flow
/*
    The first argument must be a complete selections set
    TODO: add category combos
*/
const isSelectionsEqual = (completeSet1: Object, set2: Object) =>
    Object
        .keys(completeSet1)
        .every((key) => {
            const value1 = completeSet1[key];
            const value2 = set2[key];

            if (key === 'categorycombos') {
                // handle categorycombos
            }

            return value1 === value2;
        });

export default isSelectionsEqual;
