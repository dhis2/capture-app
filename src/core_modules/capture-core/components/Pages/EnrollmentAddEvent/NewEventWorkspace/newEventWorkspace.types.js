// @flow
import type { ExternalSaveHandler } from '../../../WidgetEnrollmentEventNew';

export type Props = {|
    programId: string,
    stageId: string,
    orgUnitId: string,
    teiId: string,
    enrollmentId: string,
    dataEntryHasChanges: boolean,
    widgetReducerName: string,
    rulesExecutionDependencies: Object,
    onSave: ExternalSaveHandler,
    onSaveSuccessActionType: string,
    onSaveErrorActionType: string,
    onCancel: () => void,
|};
