// @flow

export type WidgetProps = {|
    programId: string,
    stageId: string,
    teiId: string,
    enrollmentId: string,
    orgUnitId: string,
    onSaveActionType?: string,
    onSaveSuccessActionType?: string,
    onCancel?: () => void,
|};
