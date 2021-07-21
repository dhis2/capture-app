// @flow
import type { ApiTEIEvent } from 'capture-core/events/getEnrollmentEvents';
import type { Stage } from './types/common.types';

export type Props = {|
    stages: Array<Stage>,
    events: Array<ApiTEIEvent>,
    onEventClick: (eventId: string, stageId: string) => void,
    className?: string,
|};
