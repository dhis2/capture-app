// @flow
import type { LinkedEntityData, TableColumn, LinkedRecordClick, Context } from './types';

export type Props = $ReadOnly<{|
    linkedEntities: $ReadOnlyArray<LinkedEntityData>,
    columns: $ReadOnlyArray<TableColumn>,
    onLinkedRecordClick: LinkedRecordClick,
    context: Context,
|}>;

export type StyledProps = $ReadOnly<{|
    ...Props,
    ...CssClasses,
|}>;
