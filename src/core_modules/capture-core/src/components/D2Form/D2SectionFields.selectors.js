// @flow
import { createSelectorCreator, defaultMemoize } from 'reselect';

const sectionValuesSelector = (state, props) => {
    const metaData = props.fieldsMetaData;
    const values = state.formsValues[props.dataId] || {};
    const sectionValues = Array.from(metaData.entries())
        .map(entry => entry[1])
        .reduce((accValues, metaDataElement) => {
            accValues[metaDataElement.id] = values[metaDataElement.id];
            return accValues;
        }, {});
    return sectionValues;
};

const createDeepEqualSelector = createSelectorCreator(
    defaultMemoize,
    (currentValues, prevValues) => Object.keys(currentValues).every(key => currentValues[key] === prevValues[key]),
);

export const makeGetSectionValues = () => createDeepEqualSelector(
    sectionValuesSelector,
    sectionValues => sectionValues,
);

