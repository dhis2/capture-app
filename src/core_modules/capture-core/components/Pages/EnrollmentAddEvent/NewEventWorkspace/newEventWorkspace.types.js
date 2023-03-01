// @flow
import type { ExternalSaveHandler } from '../../../WidgetEnrollmentEventNew';
import type { ProgramCategory } from '../../../FormFields/New/CategoryOptions/CategoryOptions.types';

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
    onCancel: () => void,
    programCategory?: ProgramCategory,
    ...CssClasses
|};
