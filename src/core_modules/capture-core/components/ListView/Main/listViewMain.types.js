// @flow
import type { ListViewContextBuilderPassOnProps } from '../ContextBuilder';
import type { Columns, CustomMenuContents, CustomRowMenuContents } from '../types';

type WithFilterPassOnProps = {|
    ...ListViewContextBuilderPassOnProps,
    filters: React$Node,
|};
type ComponentProps = {|
    columns: Columns,
    filters: React$Node,
    updatingWithDialog?: boolean,
    onSetColumnOrder: Function,
    rowIdKey: string,
    customMenuContents?: CustomMenuContents,
    customRowMenuContents?: CustomRowMenuContents,
    onClickListRow: Function,
    onRowSelect: Function,
    onSelectAll: Function,
    isSelectionInProgress: ?boolean,
    bulkActionBarComponent: React$Node,
    ...CssClasses,
|};

type RestProps = $Rest<WithFilterPassOnProps, ComponentProps>;

export type Props = {|
    ...RestProps,
    ...ComponentProps,
|};
