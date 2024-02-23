// @flow

export type Props = {|
    teiId: string,
    programId: string,
    orgUnitId: string,
    readOnlyMode?: ?boolean,
    onUpdateTeiAttributeValues?: ?(attributes: Array<{ [key: string]: string }>, teiDisplayName: string) => void,
|};

export type PlainProps = {|
    ...Props,
    ...CssClasses,
|};
