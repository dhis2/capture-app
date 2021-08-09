// @flow
import type { ApiTEIEvent } from 'capture-core/events/getEnrollmentEvents';
import type { StageDataElement } from '../../../types/common.types';

export type Props = {|
    events: Array<ApiTEIEvent>,
    dataElements: Array<StageDataElement>,
    eventName: string,
    stageId: string,
    ...CssClasses,
|};

