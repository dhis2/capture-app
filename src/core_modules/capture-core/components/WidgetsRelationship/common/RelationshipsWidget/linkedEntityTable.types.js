// @flow
import type { LinkedEntityData, TableColumn, LinkedRecordClick, Context } from './types';
import type { OnDeleteRelationship } from './DeleteRelationship/useDeleteRelationship';

export type Props = $ReadOnly<{|
    linkedEntities: $ReadOnlyArray<LinkedEntityData>,
    columns: $ReadOnlyArray<TableColumn>,
    onLinkedRecordClick: LinkedRecordClick,
    onDeleteRelationship: OnDeleteRelationship,
    context: Context,
|}>;

export type StyledProps = $ReadOnly<{|
    ...Props,
    ...CssClasses,
|}>;
