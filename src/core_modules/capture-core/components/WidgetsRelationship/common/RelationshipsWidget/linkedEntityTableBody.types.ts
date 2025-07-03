import type { WithStyles } from '@material-ui/core';
import type { LinkedEntityData, TableColumn, Context, LinkedRecordClick } from './types';
import type { OnDeleteRelationship } from './DeleteRelationship/useDeleteRelationship';

export type Props = Readonly<{
    linkedEntities: readonly LinkedEntityData[];
    columns: readonly TableColumn[];
    onLinkedRecordClick: LinkedRecordClick;
    context: Context;
    onDeleteRelationship: OnDeleteRelationship;
}>;

export type StyledProps = Props & WithStyles<any>;
