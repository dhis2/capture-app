// @flow
import { typeof filterTypesObject } from '../filters.const';
import type { Options } from '../../../FiltersForTypes';

export type Props = {|
    'data-test': string,
    itemId: string,
    type: $Values<filterTypesObject>,
    title: string,
    options?: ?Options,
    multiValueFilter?: boolean,
    disabled?: boolean,
    tooltipContent?: string,
    onSetVisibleSelector: Function,
    selectorVisible: boolean,
    onUpdateFilter: Function,
    onClearFilter: Function,
    onRemoveFilter?: Function,
    isRemovable?: boolean,
|};

export type FilterButtonOutputProps = {|
    ...Props,
|};
