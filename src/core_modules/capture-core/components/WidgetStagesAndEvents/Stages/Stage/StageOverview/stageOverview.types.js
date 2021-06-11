// @flow
import type { ApiTEIEvent } from 'capture-core/events/getEnrollmentEvents.js';
import type { Icon } from '../../../../../metaData';

export type Props = {|
    title: string,
    events: Array<ApiTEIEvent>,
    icon?: Icon,
    description?: string,
    ...CssClasses,
|};
