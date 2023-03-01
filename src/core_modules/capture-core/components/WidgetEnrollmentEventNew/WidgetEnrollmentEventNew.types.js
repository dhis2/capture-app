// @flow
import type { ExternalSaveHandler, RulesExecutionDependencies } from './common.types';
import type { ProgramCategory } from '../FormFields/New/CategoryOptions/CategoryOptions.types';

export type WidgetProps = {|
    programId: string,
    stageId: string,
    teiId: string,
    enrollmentId: string,
    orgUnitId: string,
    programCategory?: ProgramCategory,
    rulesExecutionDependencies: RulesExecutionDependencies,
    onSave?: ExternalSaveHandler,
    onSaveSuccessActionType?: string,
    onSaveErrorActionType?: string,
    onCancel?: () => void,
    widgetReducerName: string,
|};
