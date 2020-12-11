// @flow
import type { FilterButtonOutputProps } from './filterButton.types';
import type { FilterData } from '../../../FiltersForTypes';

export type ExtractedProps = $ReadOnly<{|
  itemId: string,
|}>;

type RestProps = $Rest<FilterButtonOutputProps, ExtractedProps>;

export type Props = {|
  ...RestProps,
  ...ExtractedProps,
|};

export type FilterButtonContextConsumerOutputProps = {|
  ...RestProps,
  itemId: string,
  filterValue?: FilterData,
|};
