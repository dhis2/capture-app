import { createSelector } from 'reselect';

const filteredOptionsSelector = (data: any) => data.options;
const onSelectFromPropsSelector = (data: any) => data.onSelect;

export const makeOnSelectSelector = () => createSelector(
    filteredOptionsSelector,
    onSelectFromPropsSelector,
    (filteredOptions: any[], onSelect: (option: any) => void) => (optionId: string) => {
        const option = filteredOptions
            .find(o => o.value === optionId);

        onSelect({
            name: option.label,
            id: option.value,
            writeAccess: option.writeAccess,
        });
    },
);
