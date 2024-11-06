// @flow

export type Props = {|
    trackedEntity: { trackedEntity: string },
    trackedEntityTypeName: string,
    trackedEntityData: Object,
    canWriteData: boolean,
    trackedEntityData: Object,
    onDeleteSuccess?: () => void,
    displayChangelog: boolean,
    teiId: string,
    programAPI: any,
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
|};
