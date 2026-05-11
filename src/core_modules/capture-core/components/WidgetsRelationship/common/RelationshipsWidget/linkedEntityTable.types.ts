import type { LinkedEntityData, TableColumn, LinkedRecordClick, Context } from './types';
import type { OnDeleteRelationship } from './DeleteRelationship/useDeleteRelationship';

export type Props = Readonly<{
    linkedEntities: readonly LinkedEntityData[];
    columns: readonly TableColumn[];
    onLinkedRecordClick: LinkedRecordClick;
    onDeleteRelationship: OnDeleteRelationship;
    context: Context;
}>;

