// @flow

export type Props = {|
    trackedEntity: { trackedEntity: string },
    trackedEntityTypeName: string,
    trackedEntityData: Object,
    canWriteData: boolean,
    onDeleteSuccess?: () => void,
    displayChangelog: boolean,
    teiId: string,
    programAPI: any,
    readOnlyMode: boolean,
|};

export type PlainProps = {|
    trackedEntity: { trackedEntity: string },
    trackedEntityTypeName: string,
    trackedEntityData: Object,
    canWriteData: boolean,
    canCascadeDeleteTei: boolean,
    onDeleteSuccess?: () => void,
    displayChangelog: boolean,
    teiId: string,
    programAPI: any,
    readOnlyMode: boolean,
|};
