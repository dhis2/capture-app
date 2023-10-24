// @flow
import type { TableColumn } from './types';

export type Props = $ReadOnly<{|
    columns: $ReadOnlyArray<TableColumn>,
|}>;
