// @flow
import type { WidgetEffects, HideWidgets } from '../common/EnrollmentOverviewDomain';
import type { ExternalSaveHandler } from '../../WidgetEnrollmentEventNew';

export type Props = {|
    programId: string,
    stageId: string,
    orgUnitId: string,
    teiId: string,
    enrollmentId: string,
    stageName: string,
    teiDisplayName: string,
    trackedEntityName: string,
    enrollmentsAsOptions: Array<Object>,
    eventDateLabel: string,
    pageStatus: string,
    onSave: ExternalSaveHandler,
    onSaveSuccessActionType: string,
    onSaveErrorActionType: string,
    onCancel: () => void,
    onDelete: () => void,
    widgetEffects: ?WidgetEffects,
    hideWidgets: HideWidgets,
    widgetReducerName: string,
    ...CssClasses,
|};
