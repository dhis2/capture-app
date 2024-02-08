// @flow
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
) => React.Element<any>

type RenderTrackedEntityRegistration = (
     trackedEntityTypeId: string,
     programId: string,
     onLinkToTrackedEntityFromRegistration: OnLinkToTrackedEntityFromRegistration,
     onLinkToTrackedEntity: OnLinkToTrackedEntityFromSearch,
     onCancel: () => void,
) => React.Element<any>

export type ContainerProps = $ReadOnly<{|
    teiId: string,
    orgUnitId: string,
    trackedEntityTypeName: ?string,
    renderElement: HTMLElement,
    relationshipTypes: RelationshipTypes,
    trackedEntityTypeId: string,
    programId: string,
    renderTrackedEntitySearch?: RenderTrackedEntitySearch,
    renderTrackedEntityRegistration: RenderTrackedEntityRegistration,
    onCloseAddRelationship?: () => void,
    onOpenAddRelationship?: () => void,
    onSelectFindMode?: OnSelectFindMode,
|}>;

export type StyledContainerProps = $ReadOnly<{|
    ...ContainerProps,
    ...CssClasses,
|}>;

export type PortalProps = $ReadOnly<{|
    renderElement: HTMLElement,
    teiId: string,
    orgUnitId: string,
    relationshipTypes: RelationshipTypes,
    trackedEntityTypeId: string,
    trackedEntityTypeName: ?string,
    programId: string,
    onSave: () => void,
    onCancel: () => void,
    onSelectFindMode?: OnSelectFindMode,
    renderTrackedEntitySearch?: RenderTrackedEntitySearch,
    renderTrackedEntityRegistration?: RenderTrackedEntityRegistration,
|}>;

export type StyledPortalProps = $ReadOnly<{|
    ...PortalProps,
    ...CssClasses,
|}>;


export type ComponentProps = $ReadOnly<{|
    teiId: string,
    orgUnitId: string,
    relationshipTypes: RelationshipTypes,
    trackedEntityTypeId: string,
    trackedEntityTypeName: ?string,
    programId: string,
    onSave: () => void,
    onCancel: () => void,
    renderTrackedEntitySearch?: RenderTrackedEntitySearch,
    renderTrackedEntityRegistration?: RenderTrackedEntityRegistration,
    onSelectFindMode?: OnSelectFindMode,
|}>;

export type StyledComponentProps = $ReadOnly<{|
    ...ComponentProps,
    ...CssClasses,
|}>;
