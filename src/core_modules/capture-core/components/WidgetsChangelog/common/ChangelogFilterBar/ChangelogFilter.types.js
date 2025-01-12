// @flow
export type FilterValueType =
    | 'SHOW_ALL'
    | { id: string, name: string };

export type RecordType = {
    reactKey: string,
    date: string,
    user: string,
    username: string,
    dataItemId: string,
    dataItemLabel: string,
    changeType: string,
    currentValue: string,
    previousValue: string,
};

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
    records: Array<RecordType>,
    filterValue: FilterValueType,
    setFilterValue: (value: FilterValueType) => void,
    columnToFilterBy: string | null,
    setColumnToFilterBy: (value: string | null) => void,
    dataItemDefinitions: DataItemDefinitions,
};
