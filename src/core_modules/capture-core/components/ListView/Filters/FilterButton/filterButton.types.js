// @flow
import { typeof filterTypesObject } from '../filterTypes';

export type Props = {|
    'data-test': string,
    itemId: string,
    type: $Values<filterTypesObject>,
    title: string,
    optionSet?: Object,
    singleSelect?: ?boolean,
    onSetVisibleSelector: Function,
    selectorVisible: boolean,
    onUpdateFilter: Function,
    onClearFilter: Function,
|};

export type FilterButtonOutputProps = {|
    ...Props,
|};
