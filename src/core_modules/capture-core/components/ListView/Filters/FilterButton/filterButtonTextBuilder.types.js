// @flow
import type { FilterData } from '../../../FiltersForTypes';
import type { OptionSet } from '../../../../metaData';
import { filterTypesObject } from '../filterTypes';
import type { FilterButtonContextConsumerOutputProps } from './filterButtonContextConsumer.types';

type ExtractedProps = $ReadOnly<{|
    filterValue?: FilterData,
    type: $Values<typeof filterTypesObject>,
    optionSet?: OptionSet,
|}>;

type RestProps = $Rest<FilterButtonContextConsumerOutputProps, ExtractedProps>;

export type Props = {|
    ...RestProps,
    ...ExtractedProps,
|};
