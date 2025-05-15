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
        }
    }
}

export type ApiEnrollmentEvent = {
    event: string;
    [key: string]: any;
};

export type Props = {
    programId: string;
    eventId: string;
    teiId: string;
    enrollmentId: string;
    programStageId: string;
    onUpdateOrAddEnrollmentEvents: (events: Array<ApiEnrollmentEvent>) => void;
    onUpdateEnrollmentEventsSuccess: (events: Array<ApiEnrollmentEvent>) => void;
    onUpdateEnrollmentEventsError: (events: Array<ApiEnrollmentEvent>) => void;
    onNavigateToEvent: (eventId: string) => void;
    actionsOptions?: {
        [K in keyof typeof relatedStageActions]?: {
            hidden?: boolean;
            disabled?: boolean;
            disabledMessage?: string;
        };
    };
    classes?: {
        header?: string;
        icon?: string;
        actions?: string;
    };
}

export type RelatedStageDataValueStates = {
    linkMode?: keyof typeof relatedStageActions;
    scheduledAt: string;
    scheduledAtFormatError?: {error: string | null; errorCode: string | null};
    orgUnit?: {
        path: string;
        id: string;
        name: string;
    };
    linkedEventId?: string;
}

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
    }
}

export type RelatedStageRefPayload = {
    getLinkedStageValues: () => {
        selectedRelationshipType: RelatedStageRelationshipType;
        relatedStageDataValues: RelatedStageDataValueStates;
        linkMode?: keyof typeof relatedStageActions;
    };
    eventHasLinkableStageRelationship: () => boolean;
    formIsValidOnSave: () => boolean;
};
