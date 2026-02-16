import type { AssigneeFilterData } from '../Assignee/types';
import type { BooleanFilterData } from '../Boolean/types';
import type { DateFilterData } from '../Date/types';
import type { EmptyOnlyFilterData } from '../EmptyOnly/types';
import type { NumericFilterData } from '../Numeric/types';
import type { OptionSetFilterData } from '../OptionSet/types';
import type { TextFilterData } from '../Text/types';
import type { TrueOnlyFilterData } from '../TrueOnly/types';

export type { UpdatableFilterContent } from './filters.types';
export type FilterData =
    AssigneeFilterData |
    BooleanFilterData |
    DateFilterData |
    EmptyOnlyFilterData |
    NumericFilterData |
    OptionSetFilterData |
    TextFilterData |
    TrueOnlyFilterData;

export type FilterDataInput = FilterData & { locked?: boolean };
