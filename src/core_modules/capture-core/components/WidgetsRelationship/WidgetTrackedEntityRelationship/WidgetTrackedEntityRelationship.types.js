// @flow
import type { RelationshipTypes } from '../common/Types';
import type { LinkedRecordClick } from '../common/RelationshipsWidget';

export type WidgetTrackedEntityRelationshipProps = {|
    trackedEntityTypeId: string,
    teiId: string,
    programId: string,
    addRelationshipRenderElement: HTMLElement,
    onLinkedRecordClick: LinkedRecordClick,
    onOpenAddRelationship?: () => void,
    onCloseAddRelationship?: () => void,
    relationshipTypes?: RelationshipTypes,
|};
