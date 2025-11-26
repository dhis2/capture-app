import type { filterTypesObject } from '../filters.const';
import type { FilterData, Options } from '../../../FiltersForTypes';

type PassOnProps = Readonly<{
    id: string;
    onClose: () => void;
    onUpdate: (value: any) => void;
    onRemove: () => void;
    isRemovable?: boolean;
    unique: boolean;
}>;

export type Props = Readonly<{
    type: typeof filterTypesObject[keyof typeof filterTypesObject];
    options?: Options | null;
    filterValue?: FilterData;
    multiValueFilter?: boolean;
}> & PassOnProps;

