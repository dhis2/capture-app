import type { filterTypesObject } from '../filters.const';
import type { FilterData, Options } from '../../../FiltersForTypes';

export type Props = Readonly<{
    id: string;
    onClose: () => void;
    onUpdate: (value: any) => void;
    onRemove: () => void;
    isRemovable?: boolean;
    type: keyof typeof filterTypesObject;
    options?: Options | null;
    classes: {
        container: string;
    };
    filterValue?: FilterData;
    multiValueFilter?: boolean;
}>;
