// @flow
import type { WidgetEffects, HideWidgets } from '../common/EnrollmentOverviewDomain';
import type { ExternalSaveHandler } from '../../WidgetEnrollmentEventNew';

export type Props = {|
    programId: string,
    stageId: string,
    orgUnitId: string,
    teiId: string,
    enrollmentId: string,
    onSave: ExternalSaveHandler,
    onSaveSuccessActionType: string,
    onSaveErrorActionType: string,
    onCancel: () => void,
    onDelete: () => void,
    onEnrollmentError: (message: string) => void,
    widgetEffects: ?WidgetEffects,
    hideWidgets: HideWidgets,
    widgetReducerName: string,
    rulesExecutionDependencies: Object,
    pageFailure: boolean,
    ready: boolean,
    ...CssClasses,
|};
