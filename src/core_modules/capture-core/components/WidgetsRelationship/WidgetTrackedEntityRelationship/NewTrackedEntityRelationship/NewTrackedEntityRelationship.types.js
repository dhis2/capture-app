// @flow
import type { RelationshipTypes } from './LinkedEntityMetadataSelector';
import type { GetPrograms } from './common';
import type { GetSearchGroups, GetSearchGroupsAsync } from './TrackedEntityFinder';

export type Props = $ReadOnly<{|
    addRelationshipRenderElement: HTMLElement,
    relationshipTypes: RelationshipTypes,
    trackedEntityTypeId: string,
    programId: string,
    onSave: () => void,
    onCancel: () => void,
    onCloseAddRelationship: () => void,
    onOpenAddRelationship: () => void,
    getPrograms: GetPrograms,
    getSearchGroups?: GetSearchGroups,
    getSearchGroupsAsync?: GetSearchGroupsAsync,
|}>;

export type PlainProps = $ReadOnly<{|
    ...Props,
    ...CssClasses,
|}>;

export type PortalProps = $ReadOnly<{|
    renderElement: HTMLElement,
    ...Props,
|}>;
