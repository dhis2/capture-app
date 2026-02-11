import { filterTypesObject } from '../filters.const';
import type { Options } from '../../../FiltersForTypes';
import type { UpdateFilter, ClearFilter, RemoveFilter } from '../../types';

export type Props = {
    'data-test': string;
    itemId: string;
    type: typeof filterTypesObject[keyof typeof filterTypesObject];
    title: string;
    options?: Options | null;
    multiValueFilter?: boolean;
    unique: boolean;
    searchOperator?: string;
    disabled?: boolean;
    tooltipContent?: string;
    onSetVisibleSelector: (itemId?: string | null) => void;
    selectorVisible: boolean;
    onUpdateFilter: UpdateFilter;
    onClearFilter: ClearFilter;
    onRemoveFilter?: RemoveFilter
    isRemovable?: boolean;
};

export type FilterButtonOutputProps = Props;
