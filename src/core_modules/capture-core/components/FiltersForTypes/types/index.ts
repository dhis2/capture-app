import type { AssigneeFilterData } from '../Assignee/assignee.types';
import type { BooleanFilterData } from '../Boolean/boolean.types';
import type { DateFilterData } from '../Date/date.types';
import type { DateTimeFilterData } from '../DateTime';
import type { EmptyOnlyFilterData } from '../EmptyOnly/emptyOnly.types';
import type { NumericFilterData } from '../Numeric/numeric.types';
import type { OptionSetFilterData } from '../OptionSet/optionSet.types';
import type { OrgUnitFilterData } from '../OrgUnit/orgUnit.types';
import type { TextFilterData } from '../Text/text.types';
import type { TimeFilterData } from '../Time';
import type { TrueOnlyFilterData } from '../TrueOnly/trueOnly.types';
import type { UsernameFilterData } from '../Username/username.types';

export type { UpdatableFilterContent } from './filters.types';
export type FilterData =
    AssigneeFilterData |
    BooleanFilterData |
    DateFilterData |
    EmptyOnlyFilterData |
    DateTimeFilterData |
    TimeFilterData |
    NumericFilterData |
    OptionSetFilterData |
    OrgUnitFilterData |
    TextFilterData |
    TrueOnlyFilterData |
    UsernameFilterData;

export type FilterDataInput = FilterData & { locked?: boolean };
