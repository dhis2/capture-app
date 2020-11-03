// @flow
import type { FilterData } from '../../../FiltersForTypes';
import { typeof dataElementTypes, type OptionSet } from '../../../../metaData';

export type Props = $ReadOnly<{
    filterValue?: FilterData,
    type: $Values<dataElementTypes>,
    optionSet: OptionSet,
}>;
