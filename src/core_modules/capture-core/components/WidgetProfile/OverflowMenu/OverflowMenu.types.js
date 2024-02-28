// @flow

export type Props = {|
    trackedEntityTypeName: string,
    canWriteData: boolean,
|};

export type PlainProps = {|
    trackedEntityTypeName: string,
    canWriteData: boolean,
    canCascadeDeleteTei: boolean,
    ...CssClasses,
|};
