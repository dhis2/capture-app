// @flow
export type Props = {|
    trackedEntityTypeId: string,
    teiId: string,
    programId: string,
    addRelationshipRenderElement: HTMLDivElement,
    onOpenAddRelationship: () => void,
    onCloseAddRelationship: () => void,
    onLinkedRecordClick: () => void,
|};
