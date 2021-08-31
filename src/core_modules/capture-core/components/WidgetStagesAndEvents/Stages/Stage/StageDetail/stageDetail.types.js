// @flow
import type { ApiTEIEvent } from 'capture-core/events/getEnrollmentEvents';
import type { StageDataElement, StageCommonProps } from '../../../types/common.types';

 type ExtractedProps = {|
    events: Array<ApiTEIEvent>,
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

