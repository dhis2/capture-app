import type { StageDataElement, StageCommonProps } from '../../../types/common.types';

type ExtractedProps = {
    events: Array<any>;
    dataElements: Array<StageDataElement>;
    eventName: string;
    hideDueDate?: boolean;
    repeatable?: boolean;
    enableUserAssignment?: boolean;
    stageId: string;
    onCreateNew: (stageId: string) => void;
    onDeleteEvent: (eventId: string) => void;
    onUpdateEventStatus: (eventId: string, status: string) => void;
    onRollbackDeleteEvent: (eventId: any) => void;
    hiddenProgramStage?: boolean;
};

export type Props = ExtractedProps & StageCommonProps;
