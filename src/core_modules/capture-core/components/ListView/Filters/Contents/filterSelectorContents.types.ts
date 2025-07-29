import type { filterTypesObject } from '../filters.const';
import type { FilterData, Options } from '../../../FiltersForTypes';

type PassOnProps = Readonly<{
    id: string;
    onClose: Function;
    onUpdate: Function;
    onRemove: Function;
    isRemovable?: boolean;
}>;
export type Props = Readonly<{
    id: string;
    onClose: Function;
    onUpdate: Function;
    onRemove: Function;
    isRemovable?: boolean;
    type: keyof typeof filterTypesObject;
    options?: Options | null;
    classes: {
        container: string;
    };
    filterValue?: FilterData;
    multiValueFilter?: boolean;
}>;
