// @flow
export type {
    AssigneeFilterData,
    AbsoluteDateFilterData,
    RelativeDateFilterData,
    DateFilterData,
    OptionSetFilterData,
    BooleanFilterData,
    TrueOnlyFilterData,
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

export type Column = {
    id: string,
    header: string,
    visible: boolean,
    type: DataElementTypes,
    optionSet?: Object,
    options?: Object,
    singleSelect?: ?boolean,
};
