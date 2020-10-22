// @flow
import { filterTypesObject } from '../filterTypes';
import type { Options } from '../../types';

export type Props = {|
    'data-test': string,
    itemId: string,
    type: $Values<typeof filterTypesObject>,
    title: string,
    options?: ?Options,
    multiValueFilter?: boolean,
    onSetVisibleSelector: Function,
    selectorVisible: boolean,
    onUpdateFilter: Function,
    onClearFilter: Function,
|};

export type FilterButtonOutputProps = {|
    ...Props,
|};
