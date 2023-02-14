// @flow
import type { ExternalSaveHandler, RulesExecutionDependencies } from './common.types';

export type WidgetProps = {|
    programId: string,
    stageId: string,
    teiId: string,
    enrollmentId: string,
    orgUnitId: string,
    programCategory?: Object,
    rulesExecutionDependencies: RulesExecutionDependencies,
    onSave?: ExternalSaveHandler,
    onSaveSuccessActionType?: string,
    onSaveErrorActionType?: string,
    onCancel?: () => void,
    widgetReducerName: string,
|};
