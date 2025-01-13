// @flow
export type FilterValueType = 'SHOW_ALL' | { id: string, name: string };

export type DataItemDefinition = {
    id: string,
    name: string,
    type: string,
    optionSet?: string,
    options?: Array<{ code: string, name: string }>,
};

export type DataItemDefinitions = {
    [key: string]: DataItemDefinition,
};

export type ChangelogFilterProps = {
    classes: { container: string },
    filterValue: FilterValueType,
    setFilterValue: (value: FilterValueType) => void,
    attributeToFilterBy: string | null,
    setAttributeToFilterBy: (value: string | null) => void,
    dataItemDefinitions: DataItemDefinitions,
};
