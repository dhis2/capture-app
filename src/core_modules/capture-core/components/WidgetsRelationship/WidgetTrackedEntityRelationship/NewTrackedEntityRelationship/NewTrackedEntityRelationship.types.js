// @flow
import * as React from 'react';
import type { RelationshipTypes } from '../../common/Types';
import type { OnLinkToTrackedEntity, OnSelectFindMode } from '../WidgetTrackedEntityRelationship.types';

type RenderTrackedEntitySearch =
    (trackedEntityTypeId: string, programId: string, onLinkToTrackedEntity: OnLinkToTrackedEntity) => React.Element<any>

export type ContainerProps = $ReadOnly<{|
    teiId: string,
    renderElement: HTMLElement,
    relationshipTypes: RelationshipTypes,
    trackedEntityTypeId: string,
    programId: string,
    renderTrackedEntitySearch?: RenderTrackedEntitySearch,
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
    relationshipTypes: RelationshipTypes,
    trackedEntityTypeId: string,
    programId: string,
    onSave: () => void,
    onCancel: () => void,
    onSelectFindMode?: OnSelectFindMode,
    renderTrackedEntitySearch?: RenderTrackedEntitySearch,
|}>;

export type StyledPortalProps = $ReadOnly<{|
    ...PortalProps,
    ...CssClasses,
|}>;


export type ComponentProps = $ReadOnly<{|
    teiId: string,
    relationshipTypes: RelationshipTypes,
    trackedEntityTypeId: string,
    programId: string,
    onSave: () => void,
    onCancel: () => void,
    renderTrackedEntitySearch?: RenderTrackedEntitySearch,
    onSelectFindMode?: OnSelectFindMode,
|}>;

export type StyledComponentProps = $ReadOnly<{|
    ...ComponentProps,
    ...CssClasses,
|}>;
