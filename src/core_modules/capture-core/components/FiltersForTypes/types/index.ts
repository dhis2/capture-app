import type { AssigneeFilter } from '../Assignee/assignee.types';
import type { BooleanFilter } from '../Boolean/boolean.types';
import type { DateFilter } from '../Date/date.types';
import type { DateTimeFilter } from '../DateTime/dateTime.types';
import type { EmptyOnlyFilterData } from '../EmptyOnly/emptyOnly.types';
import type { NumericFilter } from '../Numeric/numeric.types';
import type { OptionSetFilter } from '../OptionSet/optionSet.types';
import type { OrgUnitFilter } from '../OrgUnit/orgUnit.types';
import type { TextFilter } from '../Text/text.types';
import type { TimeFilter } from '../Time/time.types';
import type { TrueOnlyFilter } from '../TrueOnly/trueOnly.types';
import type { UsernameFilter } from '../Username/username.types';

export type { UpdatableFilterContent } from './filters.types';
export type FilterData =
    AssigneeFilter |
    BooleanFilter |
    DateFilter |
    EmptyOnlyFilterData |
    DateTimeFilter |
    TimeFilter |
    NumericFilter |
    OptionSetFilter |
    OrgUnitFilter |
    TextFilter |
    TrueOnlyFilter |
    UsernameFilter;

export type FilterDataInput = FilterData & { locked?: boolean };
