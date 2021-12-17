// @flow
import type { Stage, StageCommonProps } from '../types/common.types';

export type PlainProps = {|
    stages: Array<Stage>,
    events: Array<ApiEnrollmentEvent>,
    onEventClick: (eventId: string, stageId: string) => void,
    ...StageCommonProps,
    ...CssClasses,
|};

export type InputProps = {|
    stages?: Array<Stage>,
    events?: ?Array<ApiEnrollmentEvent>,
    onEventClick: (eventId: string, stageId: string) => void,
    ready: boolean,
    ...StageCommonProps,
|};
