// @flow

import type { RelationshipTypes } from '../../common/Types';

export type Props = $ReadOnly<{|
    relationshipTypes: RelationshipTypes,
    trackedEntityTypeId: string,
    programId: string,
    onSave: () => void,
    onCancel: () => void,
    onCloseAddRelationship?: () => void,
    onOpenAddRelationship?: () => void,
|}>;

export type PlainProps = $ReadOnly<{|
    addRelationshipRenderElement: HTMLElement,
    ...Props,
    ...CssClasses,
|}>;

export type PortalProps = $ReadOnly<{|
    renderElement: HTMLElement,
    ...Props,
|}>;
