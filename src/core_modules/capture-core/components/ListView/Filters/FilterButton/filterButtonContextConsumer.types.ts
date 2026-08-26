import type { FilterButtonOutputProps } from './filterButton.types';
import type { FilterData } from '../../../FiltersForTypes';

export type ExtractedProps = Readonly<{
    itemId: string;
}>;

type RestProps = Omit<FilterButtonOutputProps, keyof ExtractedProps>;

export type Props = RestProps & ExtractedProps;

export type FilterButtonContextConsumerOutputProps = RestProps & {
    itemId: string;
    filterValue?: FilterData;
};
