import { filterTypesObject } from '../filters.const';
import type { Options } from '../../../FiltersForTypes';

export type Props = {
    'data-test': string;
    itemId: string;
    type: keyof typeof filterTypesObject;
    title: string;
    options?: Options | null;
    multiValueFilter?: boolean;
    disabled?: boolean;
    tooltipContent?: string;
    onSetVisibleSelector: (itemId?: string) => void;
    selectorVisible: boolean;
    onUpdateFilter: (data: any, itemId: string) => void;
    onClearFilter: (itemId: string) => void;
    onRemoveFilter?: (itemId: string, options: any) => void;
    isRemovable?: boolean;
};

export type FilterButtonOutputProps = Props;
