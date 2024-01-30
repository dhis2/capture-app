// @flow
import type { Context, TableColumn } from './types';

export type Props = $ReadOnly<{|
    columns: $ReadOnlyArray<TableColumn>,
    context: Context,
|}>;
