// @flow
import type { ExternalSaveHandler, RulesExecutionDependencies } from './common.types';

export type WidgetProps = {|
    programId: string,
    stageId: string,
    teiId: string,
    enrollmentId: string,
    orgUnitId: string,
    rulesExecutionDependencies: RulesExecutionDependencies,
    onSave?: ExternalSaveHandler,
    onSaveSuccessActionType?: string,
    onSaveErrorActionType?: string,
    onSaveAndCompleteEnrollmentSuccessActionType?: string,
    onSaveAndCompleteEnrollmentErrorActionType?: string,
    onCancel?: () => void,
    widgetReducerName: string,
|};
