// @flow

export type Props = {|
    teiId: string,
    programId: string,
    trackedEntityType: string,
    orgUnitId: string,
    showEdit?: ?boolean,
    onUpdateTeiAttributeValues?: ?(attributes: Array<{ [key: string]: string }>, teiDisplayName: string) => void,
    ...CssClasses,
|};
