// @flow
import type { Node } from 'React';
import type { InputRelationshipData, RelationshipTypes } from '../Types';
import type { LinkedRecordClick } from './types';

export type Props = $ReadOnly<{|
    title: string,
    relationships?: Array<InputRelationshipData>,
    relationshipTypes: RelationshipTypes,
    isLoading: boolean,
    sourceId: string,
    onLinkedRecordClick: LinkedRecordClick,
    children: Node,
|}>;

export type StyledProps = $ReadOnly<{|
    ...Props,
    ...CssClasses,
|}>;
