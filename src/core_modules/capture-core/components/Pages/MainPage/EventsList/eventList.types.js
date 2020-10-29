// @flow
import { typeof dataElementTypes } from '../../../../metaData';

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

export type Column = {
    id: string,
    header: string,
    visible: boolean,
    type: $Keys<dataElementTypes>,
    optionSet?: Object,
    options?: Object,
    singleSelect?: ?boolean,
};
