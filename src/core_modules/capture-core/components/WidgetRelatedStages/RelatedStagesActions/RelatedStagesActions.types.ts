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
};

export type ErrorMessagesForRelatedStages = {
    scheduledAt?: string;
    orgUnit?: string;
    linkedEventId?: string;
};

export type RelatedStagesEvents = {
    id: string;
    label: string;
    isLinkable: boolean;
    status: string;
};

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
    addErrorMessage: (errorMessages: ErrorMessagesForRelatedStages) => void;
    setRelatedStagesDataValues: (updater: () => Record<string, unknown>) => void;
    onLink?: () => void;
    isLinking?: boolean;
    actionsOptions?: {
        [key in keyof typeof relatedStageActions]?: {
            hidden?: boolean;
            disabled?: boolean;
            disabledMessage?: string;
        };
    };
};

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
};
