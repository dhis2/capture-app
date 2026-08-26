import type { RelatedStageDataValueStates, RelatedStageRelationshipType } from '../../../WidgetRelatedStages';
import { relatedStageActions } from '../../../WidgetRelatedStages';

type CommonEventDetails = {
    event: string;
    program: string;
    programStage: string;
    orgUnit: string;
    trackedEntity?: string | null;
    enrollment?: string;
    scheduledAt: string;
    dataValues: Array<{ dataElement: string; value: any }>;
    status: 'ACTIVE' | 'VISITED' | 'COMPLETED' | 'SCHEDULE' | 'OVERDUE' | 'SKIPPED';
};

export type RequestEvent = {
    occurredAt: string;
    notes?: Array<{ value: string }>;
} & CommonEventDetails;

export type LinkedRequestEvent = {
    occurredAt?: string;
} & CommonEventDetails;

export type ConvertedRelatedStageEventProps = {
    linkMode: keyof typeof relatedStageActions;
    relatedStageDataValues: RelatedStageDataValueStates;
    programId: string;
    teiId?: string | null;
    currentProgramStageId: string;
    enrollmentId?: string;
    relatedStageType: RelatedStageRelationshipType;
    serverRequestEvent: RequestEvent;
};

