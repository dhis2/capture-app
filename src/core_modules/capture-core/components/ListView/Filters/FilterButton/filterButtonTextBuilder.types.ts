import type { FilterData, Options } from '../../../FiltersForTypes';
import { filterTypesObject } from '../filters.const';
import type { FilterButtonContextConsumerOutputProps } from './filterButtonContextConsumer.types';

type ExtractedProps = Readonly<{
    filterValue?: FilterData;
    type: typeof filterTypesObject[keyof typeof filterTypesObject];
    options?: Options | null;
}>;

type RestProps = Omit<FilterButtonContextConsumerOutputProps, keyof ExtractedProps>;

export type Props = RestProps & ExtractedProps & {
    filterValue?: FilterData;
    type: typeof filterTypesObject[keyof typeof filterTypesObject];
    options?: Options | null;
    buttonText?: string;
};
