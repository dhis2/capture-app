// @flow
import type { Columns } from '../types';
import type { ListViewContextProviderPassOnProps } from '../ContextProvider';

type WithFilterPassOnProps = {|
    ...ListViewContextProviderPassOnProps,
    filters: React$Node,
|};
type ComponentProps = {|
    columns: Columns,
    classes: Object,
    filters: React$Node,
    updatingWithDialog?: boolean,
    onSetColumnOrder: Function,
    rowIdKey: string,
    customMenuContents?: Array<Object>,
    onSelectRow: Function,
|};

type RestProps = $Rest<WithFilterPassOnProps, ComponentProps>;

export type Props = {|
    ...RestProps,
    ...ComponentProps,
|};
