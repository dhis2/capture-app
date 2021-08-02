// @flow
import type { ProgramStage } from '../../../metaData';
import type { WidgetEffects } from '../Enrollment/EnrollmentPageDefault/EnrollmentPageDefault.types';

export type PlainProps = {|
    programStage: ?ProgramStage,
    widgetEffects: WidgetEffects,
    mode: string,
    ...CssClasses,
|};
