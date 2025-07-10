import * as React from 'react';
import type { RelationshipTypes } from '../../common/Types';
import type {
    OnLinkToTrackedEntityFromSearch,
    OnLinkToTrackedEntityFromRegistration,
    OnSelectFindMode,
} from '../WidgetTrackedEntityRelationship.types';

type RenderTrackedEntitySearch = (
    trackedEntityTypeId: string,
    programId: string,
    onLinkToTrackedEntity: OnLinkToTrackedEntityFromSearch,
) => React.ReactElement<any>;

type RenderTrackedEntityRegistration = (
     trackedEntityTypeId: string,
     programId: string,
     onLinkToTrackedEntityFromRegistration: OnLinkToTrackedEntityFromRegistration,
     onLinkToTrackedEntity: OnLinkToTrackedEntityFromSearch,
     onCancel: () => void,
) => React.ReactElement<any>;

export type ContainerProps = Readonly<{
    teiId: string;
    orgUnitId: string;
    trackedEntityTypeName: string | null;
    renderElement: HTMLElement;
    relationshipTypes: RelationshipTypes;
    trackedEntityTypeId: string;
    programId: string;
    renderTrackedEntitySearch?: RenderTrackedEntitySearch;
    renderTrackedEntityRegistration: RenderTrackedEntityRegistration;
    onCloseAddRelationship?: () => void;
    onOpenAddRelationship?: () => void;
    onSelectFindMode?: OnSelectFindMode;
}>;

export type StyledContainerProps = ContainerProps & {
    classes: any;
};

export type PortalProps = Readonly<{
    renderElement: HTMLElement;
    teiId: string;
    orgUnitId: string;
    relationshipTypes: RelationshipTypes;
    trackedEntityTypeId: string;
    trackedEntityTypeName: string | null;
    programId: string;
    onSave: () => void;
    onCancel: () => void;
    onSelectFindMode?: OnSelectFindMode;
    renderTrackedEntitySearch?: RenderTrackedEntitySearch;
    renderTrackedEntityRegistration?: RenderTrackedEntityRegistration;
}>;

export type StyledPortalProps = PortalProps & {
    classes: any;
};

export type ComponentProps = Readonly<{
    teiId: string;
    orgUnitId: string;
    relationshipTypes: RelationshipTypes;
    trackedEntityTypeId: string;
    trackedEntityTypeName: string | null;
    programId: string;
    onSave: () => void;
    onCancel: () => void;
    renderTrackedEntitySearch?: RenderTrackedEntitySearch;
    renderTrackedEntityRegistration?: RenderTrackedEntityRegistration;
    onSelectFindMode?: OnSelectFindMode;
}>;

export type StyledComponentProps = ComponentProps & {
    classes: any;
};
