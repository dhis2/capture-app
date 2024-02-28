// @flow

export type Props = {|
    trackedEntity: { trackedEntity: string },
    trackedEntityTypeName: string,
    canWriteData: boolean,
    onDeleteSuccess?: () => void,
|};

export type PlainProps = {|
    trackedEntity: { trackedEntity: string },
    trackedEntityTypeName: string,
    canWriteData: boolean,
    canCascadeDeleteTei: boolean,
    onDeleteSuccess?: () => void,
    ...CssClasses,
|};
