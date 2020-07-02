// @flow
import { createSelectorCreator, defaultMemoize } from 'reselect';

const onIsEqual = (prevValues, currentValues) => {
    const currentValuesIsEqual = Object
        .keys(currentValues)
        .every(key => currentValues[key] === prevValues[key]);

    if (!currentValuesIsEqual) {
        return false;
    }

    const previousValuesIsEqual = Object
        .keys(prevValues)
        .every(key => prevValues[key] === currentValues[key]);

    return previousValuesIsEqual;
};


const createDeepEqualSelector = createSelectorCreator(
    defaultMemoize,
    onIsEqual,
);

const componentPropsSelector = (componentProps: ?Object) => componentProps || {};

// $FlowFixMe[missing-annot] automated comment
export const makeReselectComponentProps = () => createDeepEqualSelector(
    componentPropsSelector,
    componentProps => componentProps,
);
