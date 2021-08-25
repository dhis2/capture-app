// @flow

export type Props = {|
    programId: string,
    stageId: string,
    orgUnitId: string,
    teiId: string,
    enrollmentId: string,
    onSaveActionType: string,
    onSaveSuccessActionType: string,
    onCancel: () => void,
    ...CssClasses,
|};
