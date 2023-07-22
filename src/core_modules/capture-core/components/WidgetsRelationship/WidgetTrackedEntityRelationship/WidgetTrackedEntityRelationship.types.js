// @flow
import * as React from 'react';
import type { RelationshipTypes } from '../common/Types';
import type { LinkedRecordClick } from '../common/RelationshipsWidget';

export type RelationshipConstraint = {|
    trackedEntityTypeId: string,
    programId: ?string,
|}

export type OnLinkToTrackedEntity =
    (linkedTrackedEntityId: string, attributes?: { [attributeId: string]: string }) => void;

export type OnSelectFindModeProps = {|
    findMode: string,
    relationshipConstraint: RelationshipConstraint,
|}

export type OnSelectFindMode = (OnSelectFindModeProps) => void

export type WidgetTrackedEntityRelationshipProps = {|
    trackedEntityTypeId: string,
    teiId: string,
    programId: string,
    addRelationshipRenderElement: HTMLElement,
    onLinkedRecordClick: LinkedRecordClick,
    onOpenAddRelationship?: () => void,
    onCloseAddRelationship?: () => void,
    relationshipTypes?: RelationshipTypes,
    onSelectFindMode?: OnSelectFindMode,
    renderTrackedEntitySearch?: (
        trackedEntityTypeId: string,
        programId: string,
        onLinkToTrackedEntity: OnLinkToTrackedEntity,
    ) => React.Element<any>,
|};
