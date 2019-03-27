import { defaultMemoize, createSelectorCreator } from "reselect";


const createDeepEqualOptionsVisibilitySelector = createSelectorCreator(
    defaultMemoize,
    (prevValues, currentValues) =>
        Object.keys(currentValues).every(key => currentValues[key] === prevValues[key]),
);

const sectionOptionsVisibilitySelector = (state, props) => {
    const optionsVisibility = state.rulesEffectsOptionsVisibility[props.formId] || {};
    return {
        hideOptions: optionsVisibility.hideOptions && optionsVisibility.hideOptions[props.id],
        hideOptionGroups: optionsVisibility.hideOptionGroups && optionsVisibility.hideOptionGroups[props.id],
        showOptionGroups: optionsVisibility.showOptionGroups && optionsVisibility.showOptionGroups[props.id],
    };
};
export const makeGetOptionsVisibility = () => createDeepEqualOptionsVisibilitySelector(
    sectionOptionsVisibilitySelector,
    sectionOptionsVisibility => sectionOptionsVisibility,
);
