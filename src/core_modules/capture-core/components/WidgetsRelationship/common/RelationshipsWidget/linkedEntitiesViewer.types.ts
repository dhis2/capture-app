import type { WithStyles } from '@material-ui/core';
import type { GroupedLinkedEntities, LinkedRecordClick } from './types';
import type { OnDeleteRelationship } from './DeleteRelationship/useDeleteRelationship';

export type Props = Readonly<{
    groupedLinkedEntities: GroupedLinkedEntities;
    onLinkedRecordClick: LinkedRecordClick;
    onDeleteRelationship: OnDeleteRelationship;
}>;

export type StyledProps = Props & WithStyles<any>;
