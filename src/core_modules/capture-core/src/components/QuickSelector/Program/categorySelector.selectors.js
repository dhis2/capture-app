// @flow
import { createSelector } from 'reselect';

const selectedOrgUnitIdSelector = data => data.selectedOrgUnitId;
const categoryOptionsSelector = data => data.categoryOptions;

// $FlowFixMe
export const makeOptionsSelector = () => createSelector(
    selectedOrgUnitIdSelector,
    categoryOptionsSelector,
    (selectedOrgUnitId, categoryOptions) => {
        const ouFilteredCategoryOptions = !selectedOrgUnitId ?
            categoryOptions :
            categoryOptions
                .filter(option =>
                    !option.organisationUnitIds || option.organisationUnitIds[selectedOrgUnitId]);

        return ouFilteredCategoryOptions
            .map(option => ({
                label: option.displayName,
                value: option.id,
            }));
    },
);

const filteredOptionsSelector = data => data.options;
const onSelectFromPropsSelector = data => data.onSelect;

// $FlowFixMe
export const makeOnSelectSelector = () => createSelector(
    filteredOptionsSelector,
    onSelectFromPropsSelector,
    (filteredOptions, onSelect) => (optionId) => {
        const option = filteredOptions
            .find(o => o.value === optionId);

        onSelect({
            name: option.label,
            id: option.value,
        });
    },
);
