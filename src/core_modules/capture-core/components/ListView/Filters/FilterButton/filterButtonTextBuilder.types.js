// @flow
import type { FilterData } from '../../../FiltersForTypes';
import { filterTypesObject } from '../filterTypes';
import type { Options } from '../../types';
import type { FilterButtonContextConsumerOutputProps } from './filterButtonContextConsumer.types';

type ExtractedProps = $ReadOnly<{|
    filterValue?: FilterData,
    type: $Values<typeof filterTypesObject>,
    options?: ?Options,
|}>;

type RestProps = $Rest<FilterButtonContextConsumerOutputProps, ExtractedProps>;

export type Props = {|
    ...RestProps,
    ...ExtractedProps,
|};
