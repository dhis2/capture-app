// @flow
import type { WidgetEffects, HideWidgets } from '../common/EnrollmentOverviewDomain';
import type { ProgramStage } from '../../../metaData';

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
    pageStatus: string,
    ...CssClasses,
|};
