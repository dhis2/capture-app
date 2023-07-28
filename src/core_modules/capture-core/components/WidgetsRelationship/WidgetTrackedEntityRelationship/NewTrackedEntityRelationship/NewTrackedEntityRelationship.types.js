// @flow
import type { RelationshipTypes } from '../../common/Types';

export type ContainerProps = $ReadOnly<{|
    renderElement: HTMLElement,
    relationshipTypes: RelationshipTypes,
    trackedEntityTypeId: string,
    programId: string,
    onCloseAddRelationship?: () => void,
    onOpenAddRelationship?: () => void,
|}>;

export type StyledContainerProps = $ReadOnly<{|
    ...ContainerProps,
    ...CssClasses,
|}>;

export type PortalProps = $ReadOnly<{|
    renderElement: HTMLElement,
    relationshipTypes: RelationshipTypes,
    trackedEntityTypeId: string,
    programId: string,
    onSave: () => void,
    onCancel: () => void,
|}>;

export type StyledPortalProps = $ReadOnly<{|
    ...PortalProps,
    ...CssClasses,
|}>;


export type ComponentProps = $ReadOnly<{|
    relationshipTypes: RelationshipTypes,
    trackedEntityTypeId: string,
    programId: string,
    onSave: () => void,
    onCancel: () => void,
|}>;

export type StyledComponentProps = $ReadOnly<{|
    ...ComponentProps,
    ...CssClasses,
|}>;
