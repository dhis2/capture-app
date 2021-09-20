// @flow
import type { StageDataElement, StageCommonProps } from '../../../types/common.types';

 type ExtractedProps = {|
    events: Array<ApiEnrollmentEvent>,
    dataElements: Array<StageDataElement>,
    eventName: string,
    hideDueDate?: boolean,
    repeatable?: boolean,
    stageId: string,
    ...CssClasses,
|};

export type Props = {|
    ...ExtractedProps,
    ...StageCommonProps,
|}

