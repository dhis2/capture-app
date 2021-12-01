// @flow
import type { TrueOnlyFilterData } from '../TrueOnly/types';
import type { TextFilterData } from '../Text/types';
import type { OptionSetFilterData } from '../OptionSet/types';
import type { NumericFilterData } from '../Numeric/types';
import type { DateFilterData } from '../Date/types';
import type { BooleanFilterData } from '../Boolean/types';
import type { AssigneeFilterData } from '../Assignee/types';

export { UpdatableFilterContent } from './filters.types';
export type FilterData =
    AssigneeFilterData |
    BooleanFilterData |
    DateFilterData |
    NumericFilterData |
    OptionSetFilterData |
    TextFilterData |
    TrueOnlyFilterData;
