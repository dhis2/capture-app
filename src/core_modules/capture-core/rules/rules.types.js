// @flow
import type {
    EventData,
    EventsData,
    OrgUnit,
    TEIValues,
    Enrollment,
    ProgramRule,
    ProgramRuleVariable,
    TrackedEntityAttribute,
} from '@dhis2/rules-engine-javascript';
import type { ProgramStage, TrackerProgram, EventProgram, RenderFoundation } from '../metaData';

export type GetApplicableRuleEffectsForTrackerProgramInput = {|
    program: TrackerProgram,
    stage?: ProgramStage,
    orgUnit: OrgUnit,
    currentEvent?: EventData,
    otherEvents?: EventsData,
    attributeValues?: TEIValues,
    enrollmentData?: Enrollment,
    formFoundation?: RenderFoundation,
|};

export type GetApplicableRuleEffectsForEventProgramInput = {|
    program: EventProgram,
    orgUnit: OrgUnit,
    currentEvent?: EventData,
|};

export type GetApplicableRuleEffectsInput = {|
    orgUnit: OrgUnit,
    currentEvent?: EventData,
    otherEvents?: EventsData,
    attributeValues?: TEIValues,
    enrollmentData?: Enrollment,
    stages: Map<string, ProgramStage>,
    programRules: Array<ProgramRule>,
    programRuleVariables: Array<ProgramRuleVariable>,
    trackedEntityAttributes?: { [string]: TrackedEntityAttribute },
    foundationForPostProcessing: RenderFoundation,
|};
