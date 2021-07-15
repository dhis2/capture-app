// @flow
import { ProgramStage } from '../../../metaData';
import type { WidgetEffects } from '../Enrollment/EnrollmentPageDefault/EnrollmentPageDefault.types';

export type Props = {|
    programStage: ProgramStage,
    widgetEffects: ?WidgetEffects,
    onDelete: () => void,
    ...CssClasses,
|};
