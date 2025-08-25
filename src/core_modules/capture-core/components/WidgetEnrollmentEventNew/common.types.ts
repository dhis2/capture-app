import type { ProgramStage, RenderFoundation, TrackerProgram } from '../../metaData';
import type { ApiEnrollmentEvent } from '../../../capture-core-utils/types/api-types';
import type { EventsData } from '../../rules/RuleEngine/types/ruleEngine.types';

export type ExternalSaveHandler = (eventServerValues: Record<string, unknown>, uid: string) => void;

export type AttributeValueServerFormatted = {
    id: string;
    value: string;
};

export type EnrollmentData = {
    enrolledAt?: string;
    occurredAt?: string;
    enrollmentId: string;
};

export type RulesExecutionDependencies = {
    events: Array<ApiEnrollmentEvent>;
    attributeValues: Array<AttributeValueServerFormatted>;
    enrollmentData: EnrollmentData;
};

export type EnrollmentEvent = {
    eventId?: string;
    programId: string;
    programStageId: string;
    orgUnitId: string;
    trackedEntityInstanceId: string;
    enrollmentId: string;
    enrollmentStatus: string;
    status: 'COMPLETED' | 'ACTIVE' | 'VISITED' | 'SCHEDULE' | 'OVERDUE' | 'SKIPPED';
    eventDate?: string;
    dueDate?: string;
    lastUpdated: string;
    notes?: Array<Record<string, unknown>>;
    [dataElementId: string]: any;
};

export type EnrollmentEvents = Array<EnrollmentEvent>;

export type AttributeValuesClientFormatted = {
    [id: string]: any;
};

export type RulesExecutionDependenciesClientFormatted = {
    events: EventsData;
    attributeValues: AttributeValuesClientFormatted;
    enrollmentData: EnrollmentData;
};

export type CommonValidatedProps = {
    program: TrackerProgram;
    stage: ProgramStage;
    formFoundation: RenderFoundation;
    teiId: string;
    enrollmentId: string;
    rulesExecutionDependencies: RulesExecutionDependencies;
    onSaveExternal?: ExternalSaveHandler;
    onSaveSuccessActionType?: string;
    onSaveErrorActionType?: string;
    onSaveAndCompleteEnrollmentSuccessActionType?: string;
    onSaveAndCompleteEnrollmentErrorActionType?: string;
    widgetReducerName: string;
    onCancel?: () => void;
};
