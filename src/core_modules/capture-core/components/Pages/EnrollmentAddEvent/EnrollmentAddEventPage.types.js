// @flow
import { Program, ProgramStage } from '../../../metaData';
import type { WidgetEffects } from '../Enrollment/EnrollmentPageDefault/EnrollmentPageDefault.types';

export type Props = {|
    programStage: ProgramStage,
    widgetEffects: ?WidgetEffects,
    program: Program,
    teiId: string,
    enrollmentId: string,
    onDelete: () => void,
    ...CssClasses,
|};
