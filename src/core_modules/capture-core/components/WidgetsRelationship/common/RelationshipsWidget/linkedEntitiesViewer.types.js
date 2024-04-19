// @flow
import type { GroupedLinkedEntities, LinkedRecordClick } from './types';
import type { OnDeleteRelationship } from './DeleteRelationship/useDeleteRelationship';

export type Props = $ReadOnly<{|
    groupedLinkedEntities: GroupedLinkedEntities,
    onLinkedRecordClick: LinkedRecordClick,
    onDeleteRelationship: OnDeleteRelationship,
|}>;

export type StyledProps = $ReadOnly<{|
    ...Props,
    ...CssClasses,
|}>;
