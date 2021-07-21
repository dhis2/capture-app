// @flow
import type { ApiTEIEvent } from 'capture-core/events/getEnrollmentEvents';
import type { Stage } from '../../types/common.types';

export type Props = {|
    stage: Stage,
    events: Array<ApiTEIEvent>,
    className?: string,
    ...CssClasses,
|};
