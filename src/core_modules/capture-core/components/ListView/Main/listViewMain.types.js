// @flow
import type { ListViewContextBuilderPassOnProps } from '../ContextBuilder';
import type { CustomRowMenuContents, CustomMenuContents, Columns } from '../types';

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
    onSelectRow: Function,
    ...CssClasses,
|};

type RestProps = $Rest<WithFilterPassOnProps, ComponentProps>;

export type Props = {|
    ...RestProps,
    ...ComponentProps,
|};
