// @flow
import type { Columns } from '../types';
import type { ListViewContextBuilderPassOnProps } from '../ContextBuilder';

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
  customMenuContents?: Array<Object>,
  onSelectRow: Function,
  ...CssClasses,
|};

type RestProps = $Rest<WithFilterPassOnProps, ComponentProps>;

export type Props = {|
  ...RestProps,
  ...ComponentProps,
|};
