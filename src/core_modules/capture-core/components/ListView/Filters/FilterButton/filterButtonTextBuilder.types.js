// @flow
import type { FilterData } from '../../../FiltersForTypes';
import { dataElementTypes, type OptionSet } from '../../../../metaData';

export type Props = $ReadOnly<{
    filterValue?: FilterData,
    type: $Values<typeof dataElementTypes>,
    optionSet: OptionSet,
}>;
