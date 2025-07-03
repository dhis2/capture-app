import type { ReactNode } from 'react';
import type { WithStyles } from '@material-ui/core';
import type { InputRelationshipData, RelationshipTypes } from '../Types';
import type { LinkedRecordClick } from './types';

export type Props = Readonly<{
    title: string;
    relationships?: Array<InputRelationshipData>;
    relationshipTypes: RelationshipTypes;
    isLoading: boolean;
    sourceId: string;
    onLinkedRecordClick: LinkedRecordClick;
    children: ReactNode;
}>;

export type StyledProps = Props & WithStyles<any>;
