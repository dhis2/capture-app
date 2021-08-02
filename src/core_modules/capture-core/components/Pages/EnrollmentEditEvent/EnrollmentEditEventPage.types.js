// @flow
import type { ProgramStage } from '../../../metaData';
import type { WidgetEffects } from '../Enrollment/EnrollmentPageDefault/EnrollmentPageDefault.types';

export type PlainProps = {|
    programStage: ?ProgramStage,
    widgetEffects: WidgetEffects,
    teiId: string,
    enrollmentId: string,
    programId: string,
    mode: string,
    ...CssClasses,
|};
