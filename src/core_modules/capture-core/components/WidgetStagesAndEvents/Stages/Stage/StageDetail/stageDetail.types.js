// @flow
import type { StageDataElement, StageCommonProps } from '../../../types/common.types';

type ExtractedProps = {|
    events: Array<ApiEnrollmentEvent>,
    dataElements: Array<StageDataElement>,
    eventName: string,
    hideDueDate?: boolean,
    repeatable?: boolean,
    enableUserAssignment?: boolean,
    stageId: string,
    onCreateNew: (stageId: string) => void,
    onDeleteEvent: (eventId: string) => void,
    onUpdateEventStatus: (eventId: string, status: string) => void,
    onRollbackDeleteEvent: (eventId: ApiEnrollmentEvent) => void,
    hiddenProgramStage?: boolean,
    ...CssClasses,
|};

export type Props = {|
    ...ExtractedProps,
    ...StageCommonProps,
|}

