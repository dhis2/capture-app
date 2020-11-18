// @flow
import type { FilterData, Options } from '../../../FiltersForTypes';
import { typeof filterTypesObject } from '../filters.const';
import type { FilterButtonContextConsumerOutputProps } from './filterButtonContextConsumer.types';

type ExtractedProps = $ReadOnly<{|
    filterValue?: FilterData,
    type: $Values<filterTypesObject>,
    options?: ?Options,
|}>;

type RestProps = $Rest<FilterButtonContextConsumerOutputProps, ExtractedProps>;

export type Props = {|
    ...RestProps,
    ...ExtractedProps,
    filterValue?: FilterData,
    type: $Values<filterTypesObject>,
    options?: ?Options,
    buttonText?: string,
|};
