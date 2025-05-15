import type { RelatedStageDataValueStates } from '../WidgetRelatedStages.types';
import { relatedStageActions } from '../index';

export type Constraint = {
    programStage: {
        id: string;
        program: {
            id: string;
        };
    };
    relationshipEntity: 'PROGRAM_STAGE_INSTANCE';
}

export type ErrorMessagesForRelatedStages = {
    scheduledAt?: string | null;
    orgUnit?: string | null;
    linkedEventId?: string | null;
}

export type RelatedStagesEvents = {
    id: string;
    label: string;
    isLinkable: boolean;
    status: string;
}

export type PlainProps = {
    type: string;
    relationshipName: string;
    relatedStagesDataValues: RelatedStageDataValueStates;
    events: Array<RelatedStagesEvents>;
    linkableEvents: Array<RelatedStagesEvents>;
    scheduledLabel: string;
    saveAttempted: boolean;
    errorMessages: ErrorMessagesForRelatedStages;
    constraint?: Constraint;
    addErrorMessage: (messages: ErrorMessagesForRelatedStages) => void;
    setRelatedStagesDataValues: (callback: (prevState: RelatedStageDataValueStates) => RelatedStageDataValueStates) => void;
    onLink?: () => void;
    isLinking?: boolean;
    actionsOptions?: {
        [key in keyof typeof relatedStageActions]?: {
            hidden?: boolean;
            disabled?: boolean;
            disabledMessage?: string;
        };
    };
    classes?: {
        wrapper?: string;
        fieldWrapper?: string;
        fieldLabel?: string;
        fieldContent?: string;
        alternateColor?: string;
        clearSelections?: string;
        link?: string;
    };
}

export type Props = {
    programId: string;
    enrollmentId?: string;
    programStageId: string;
    onLink?: () => void;
    isLinking?: boolean;
    actionsOptions?: {
        [key in keyof typeof relatedStageActions]?: {
            hidden?: boolean;
            disabled?: boolean;
            disabledMessage?: string;
        };
    };
}
