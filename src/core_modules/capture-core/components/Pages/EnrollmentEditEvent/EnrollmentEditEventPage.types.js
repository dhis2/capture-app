// @flow
import type { ProgramStage } from '../../../metaData';
import type { WidgetEffects, HideWidgets } from '../Enrollment/EnrollmentPageDefault/EnrollmentPageDefault.types';

export type PlainProps = {|
    programStage: ?ProgramStage,
    widgetEffects: WidgetEffects,
    hideWidgets: HideWidgets,
    teiId: string,
    enrollmentId: string,
    programId: string,
    mode: string,
    orgUnitId: string,
    trackedEntityName: string,
    teiDisplayName: string,
    eventDate?: string,
    enrollmentsAsOptions: Array<Object>,
    onDelete: () => void,
    onGoBack: () => void,
    ...CssClasses,
|};
