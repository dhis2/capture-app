// @flow
import type { Node } from 'React';
import type { InputRelationshipData, RelationshipTypes } from '../Types';
import type { LinkedRecordClick } from './types';

export type Props = $ReadOnly<{|
    title: string,
    relationships?: Array<InputRelationshipData>,
    cachedRelationshipTypes?: RelationshipTypes,
    sourceId: string,
    onLinkedRecordClick: LinkedRecordClick,
    children: (relationshipTypes: RelationshipTypes) => Node,
|}>;

export type StyledProps = $ReadOnly<{|
    ...Props,
    ...CssClasses,
|}>;
