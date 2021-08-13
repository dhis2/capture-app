// @flow
import type { ApiTEIEvent } from 'capture-core/events/getEnrollmentEvents';
import type { Stage, StageCommonProps } from './types/common.types';

type ExtractedProps = {|
    stages: Array<Stage>,
    events: Array<ApiTEIEvent>,
    className?: string,
|};

export type Props = {|
    ...ExtractedProps,
    ...StageCommonProps
|}
