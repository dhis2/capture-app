// @flow
export type {
    AssigneeFilterData,
    AbsoluteDateFilterData,
    RelativeDateFilterData,
    DateFilterData,
    OptionSetFilterData,
    BooleanFilterData,
    TextFilterData,
    NumericFilterData,
} from '../../../FiltersForTypes/filters.types';
export {
    assigneeFilterModes,
    dateFilterTypes,
} from '../../../FiltersForTypes/filters.types';

export type CommonQueryData = {
    programId: string,
    orgUnitId: string,
    categories: ?Object,
}

export type WorkingListConfig = {
    filters: Array<{id: string, requestData: any, appliedText: string, value: any}>,
    sortById: ?string,
    sortByDirection: ?string,
    columnOrder: Array<Object>,
}

export type ColumnConfig = {
    id: string,
    visible: boolean,
    isMainProperty?: ?boolean,
    apiName?: ?string,
};

