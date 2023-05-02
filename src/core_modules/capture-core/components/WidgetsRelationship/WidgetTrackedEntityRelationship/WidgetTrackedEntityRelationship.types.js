// @flow
import type { RelationshipTypes, UrlParameters } from '../common/Types';

export type Props = {|
    trackedEntityTypeId: string,
    teiId: string,
    programId: string,
    addRelationshipRenderElement: HTMLElement,
    onLinkedRecordClick: (parameters: UrlParameters) => void,
    onOpenAddRelationship?: () => void,
    onCloseAddRelationship?: () => void,
    cachedRelationshipTypes?: RelationshipTypes,
|}
