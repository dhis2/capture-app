// @flow
import type { Stage, StageCommonProps, Event } from './types/common.types';


type ExtractedProps = {|
    stages?: Array<Stage>,
    events: ?Array<Event>,
    onEventClick: (eventId: string, stageId: string) => void,
    className?: string,
|};

export type Props = {|
    ...ExtractedProps,
    ...StageCommonProps
|}
