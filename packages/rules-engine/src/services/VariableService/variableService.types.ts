import { typeKeys } from '../../constants';
import { eventStatuses } from './constants';
import type { DataElements, TrackedEntityAttributes, OrgUnit } from '../../rulesEngine.types';

export type ProgramRuleVariable = {
    id: string,
    displayName: string,
    programRuleVariableSourceType: string,
    valueType: string,
    programId: string,
    dataElementId?: string | null,
    trackedEntityAttributeId?: string | null,
    programStageId?: string | null,
    useNameForOptionSet?: boolean | null,
};

type EventMain = {
    readonly eventId?: string,
    readonly programId?: string,
    readonly programStageId?: string,
    readonly programStageName?: string,
    readonly orgUnitId?: string,
    readonly trackedEntityInstanceId?: string,
    readonly enrollmentId?: string,
    readonly enrollmentStatus?: string,
    readonly status?: typeof eventStatuses[keyof typeof eventStatuses],
    readonly occurredAt?: string,
    readonly scheduledAt?: string,
    readonly createdAt?: string,
};

export type EventValues = {
    [elementId: string]: any,
};

export type EventData = EventValues & EventMain;

export type EventsData = Array<EventData>;

export type EventsDataContainer = {
    all: EventsData,
    byStage: { [stageId: string]: EventsData },
};

export type TEIValues = {
    [attributeId: string]: any,
};

export type Enrollment = {
    readonly enrolledAt?: string,
    readonly occurredAt?: string,
    readonly enrollmentId?: string,
    readonly programName?: string,
    readonly enrollmentStatus?: string,
};

export type Option = {
    id: string,
    code: string,
    displayName: string,
};

export type OptionSet = {
    id: string,
    displayName: string,
    options: Array<Option>,
};

export type OptionSets = {
    [id: string]: OptionSet,
};

type Constant = {
    id: string,
    displayName: string,
    value: any,
};

export type Constants = Array<Constant>;

export type VariableServiceInput = {
    programRuleVariables: Array<ProgramRuleVariable> | null,
    currentEvent?: EventData,
    otherEvents?: EventsData,
    dataElements: DataElements | null,
    selectedEntity?: TEIValues | null,
    trackedEntityAttributes?: TrackedEntityAttributes | null,
    selectedEnrollment?: Enrollment | null,
    selectedOrgUnit: OrgUnit | null,
    optionSets: OptionSets,
    constants?: Constants | null,
};

export type CompareDates = (firstRulesDate: string | null, secondRulesDate: string | null) => number;

export type ProcessValue = (value: any, type: typeof typeKeys[keyof typeof typeKeys]) => any;
