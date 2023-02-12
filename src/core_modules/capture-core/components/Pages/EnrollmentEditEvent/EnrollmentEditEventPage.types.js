// @flow
import type { ProgramStage } from '../../../metaData';
import type { WidgetEffects, HideWidgets } from '../common/EnrollmentOverviewDomain';
import type { CategoryOption } from '../../FormFields/New/CategoryOptions/CategoryOptions.types';

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
    scheduleDate?: string,
    enrollmentsAsOptions: Array<Object>,
    selectedCategories?: ?{[categoryId: string]: CategoryOption },
    onDelete: () => void,
    onAddNew: () => void,
    onGoBack: () => void,
    onEnrollmentError: (message: string) => void,
    onCancelEditEvent: () => void,
    onHandleScheduleSave: (eventData: Object) => void,
    pageStatus: string,
    eventStatus?: string,
    ...CssClasses,
|};

export type Props = {|
    programId: string,
    stageId: string,
    teiId: string,
    enrollmentId: string,
    orgUnitId: string,
    eventId: string,
|};
