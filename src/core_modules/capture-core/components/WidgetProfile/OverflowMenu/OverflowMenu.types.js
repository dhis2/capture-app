// @flow

export type Props = {|
    trackedEntity: { trackedEntity: string },
    trackedEntityTypeName: string,
    canWriteData: boolean,
    onDeleteSuccess?: () => void,
    displayChangelog: boolean,
    teiId: string,
    programAPI: any,
|};

export type PlainProps = {|
    trackedEntity: { trackedEntity: string },
    trackedEntityTypeName: string,
    canWriteData: boolean,
    canCascadeDeleteTei: boolean,
    onDeleteSuccess?: () => void,
    displayChangelog: boolean,
    teiId: string,
    programAPI: any,
|};
