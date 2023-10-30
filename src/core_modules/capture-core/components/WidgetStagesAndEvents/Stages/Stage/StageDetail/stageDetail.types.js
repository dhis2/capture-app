// @flow
import type { StageDataElement, StageCommonProps } from '../../../types/common.types';

 type ExtractedProps = {|
    events: Array<ApiEnrollmentEvent>,
    dataElements: Array<StageDataElement>,
    eventName: string,
    hideDueDate?: boolean,
    repeatable?: boolean,
    enableUserAssignment?: boolean,
    stageId: string,
    hiddenProgramStage?: boolean,
    ...CssClasses,
|};

export type Props = {|
    ...ExtractedProps,
    ...StageCommonProps,
|}

