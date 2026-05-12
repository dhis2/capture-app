import * as React from 'react';
import type { RelationshipTypes } from '../common/Types';
import type { LinkedRecordClick } from '../common/RelationshipsWidget';

export type RelationshipConstraint = {
    trackedEntityTypeId: string;
    programId: string | null;
};

export type OnLinkToTrackedEntityFromSearch =
    (linkedTrackedEntityId: string, attributes?: { [attributeId: string]: string }) => void;

export type OnLinkToTrackedEntityFromRegistration =
    (teiPayload: Record<string, unknown>) => void;

export type OnSelectFindModeProps = {
    findMode: string;
    orgUnitId: string;
    relationshipConstraint: RelationshipConstraint;
};

export type OnSelectFindMode = (props: OnSelectFindModeProps) => void;

export type WidgetTrackedEntityRelationshipProps = {
    trackedEntityTypeId: string;
    teiId: string;
    programId: string;
    orgUnitId: string;
    addRelationshipRenderElement: HTMLElement;
    onLinkedRecordClick: LinkedRecordClick;
    onOpenAddRelationship?: () => void;
    onCloseAddRelationship?: () => void;
    relationshipTypes?: RelationshipTypes;
    onSelectFindMode?: OnSelectFindMode;
    renderTrackedEntityRegistration: (
        trackedEntityTypeId: string,
        programId: string,
        onLinkToTrackedEntityFromRegistration: OnLinkToTrackedEntityFromRegistration,
        onLinkToTrackedEntityFromSearch: OnLinkToTrackedEntityFromSearch,
        onCancel: () => void,
    ) => React.ReactElement<any>;
    renderTrackedEntitySearch?: (
        trackedEntityTypeId: string,
        programId: string,
        onLinkToTrackedEntityFromSearch: OnLinkToTrackedEntityFromSearch,
    ) => React.ReactElement<any>;
};
