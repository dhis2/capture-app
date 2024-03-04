// @flow
import type { LinkedEntityData, TableColumn, Context, LinkedRecordClick } from './types';
import type { OnDeleteRelationship } from './DeleteRelationship/useDeleteRelationship';

export type Props = $ReadOnly<{|
    linkedEntities: $ReadOnlyArray<LinkedEntityData>,
    columns: $ReadOnlyArray<TableColumn>,
    onLinkedRecordClick: LinkedRecordClick,
    context: Context,
    onDeleteRelationship: OnDeleteRelationship,
|}>;

export type StyledProps = $ReadOnly<{|
    ...Props,
    ...CssClasses,
|}>;
