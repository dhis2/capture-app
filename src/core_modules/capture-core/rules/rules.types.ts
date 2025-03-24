import type {
    EventData,
    EventsData,
    OrgUnit,
    TEIValues,
    Enrollment,
    ProgramRule,
    ProgramRuleVariable,
    TrackedEntityAttributes,
} from './RuleEngine';
import type { ProgramStage, TrackerProgram, EventProgram, RenderFoundation } from '../metaData';

export type GetApplicableRuleEffectsForTrackerProgramInput = {
    program: TrackerProgram;
    stage?: ProgramStage;
    orgUnit: OrgUnit | null;
    currentEvent?: EventData;
    otherEvents?: EventsData;
    attributeValues?: TEIValues;
    enrollmentData?: Enrollment;
    formFoundation?: RenderFoundation;
};

export type GetApplicableRuleEffectsForEventProgramInput = {
    program: EventProgram;
    orgUnit: OrgUnit | null;
    currentEvent?: EventData;
};

export type GetApplicableRuleEffectsInput = {
    orgUnit: OrgUnit | null;
    currentEvent?: EventData;
    otherEvents?: EventsData;
    attributeValues?: TEIValues;
    enrollmentData?: Enrollment;
    stages: Map<string, ProgramStage>;
    programRules: Array<ProgramRule>;
    programRuleVariables: Array<ProgramRuleVariable>;
    trackedEntityAttributes?: TrackedEntityAttributes;
    foundationForPostProcessing: RenderFoundation;
};
