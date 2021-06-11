// @flow
import type { ApiTEIEvent } from 'capture-core/events/getEnrollmentEvents.js';

export type Props = {|
    events: Array<ApiTEIEvent>,
    data: any,
    eventName: string,
    ...CssClasses,
|};

