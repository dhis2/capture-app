import { relatedStageActions } from './index';
import type { Constraint } from './RelatedStagesActions/RelatedStagesActions.types';

export type RelationshipType = {
    fromConstraint: Constraint;
    toConstraint: Constraint;
    bidirectional: boolean;
    displayName: string;
    id: string;
    access: {
        data: {
            write: boolean;
        };
    };
};

export type Props = {
    programId: string;
    eventId: string;
    teiId: string;
    enrollmentId: string;
    programStageId: string;
    onUpdateOrAddEnrollmentEvents: (events: Array<any>) => void;
    onUpdateEnrollmentEventsSuccess: (events: Array<any>) => void;
    onUpdateEnrollmentEventsError: (events: Array<any>) => void;
    onNavigateToEvent: (eventId: string) => void;
    actionsOptions?: {
        [key in keyof typeof relatedStageActions]?: {
            hidden?: boolean;
            disabled?: boolean;
            disabledMessage?: string;
        };
    };
};

export type RelatedStageDataValueStates = {
    linkMode?: keyof typeof relatedStageActions;
    scheduledAt: string;
    scheduledAtFormatError?: { error?: string; errorCode?: string };
    orgUnit?: {
        path: string;
        id: string;
        name: string;
    };
    linkedEventId?: string;
};

export type RelatedStageRelationshipType = {
    id: string;
    displayName: string;
    fromConstraint: {
        programStage: {
            id: string;
        };
    };
    toConstraint: {
        programStage: {
            id: string;
        };
    };
};

export type RelatedStageRefPayload = {
    getLinkedStageValues: () => {
        selectedRelationshipType: RelatedStageRelationshipType;
        relatedStageDataValues: RelatedStageDataValueStates;
        linkMode?: keyof typeof relatedStageActions;
    };
    eventHasLinkableStageRelationship: () => boolean;
    formIsValidOnSave: () => boolean;
};
