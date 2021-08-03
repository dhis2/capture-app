// @flow
import { ProgramStage } from '../../../metaData';
import type { WidgetEffects, HideWidgets } from '../Enrollment/EnrollmentPageDefault/EnrollmentPageDefault.types';

export type Props = {|
    programId: string,
    programStage: ProgramStage,
    widgetEffects: ?WidgetEffects,
    hideWidgets: HideWidgets,
    teiId: string,
    enrollmentId: string,
    onDelete: () => void,
    ...CssClasses,
|};
