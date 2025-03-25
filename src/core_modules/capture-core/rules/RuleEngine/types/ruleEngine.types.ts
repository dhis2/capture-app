import {
    effectActions,
    eventStatuses,
    rulesEngineEffectTargetDataTypes,
} from '../constants';

export type ProgramRuleVariable = {
    id: string;
    displayName: string;
    programRuleVariableSourceType: string;
    valueType: string;
    programId: string;
    dataElementId?: string | null;
    trackedEntityAttributeId?: string | null;
    programStageId?: string | null;
    useNameForOptionSet?: boolean | null;
};

type EventMain = {
    eventId?: string;
    programId?: string;
    programStageId?: string;
    programStageName?: string;
    orgUnitId?: string;
    trackedEntityInstanceId?: string;
    enrollmentId?: string;
    enrollmentStatus?: string;
    status?: typeof eventStatuses[keyof typeof eventStatuses];
    occurredAt?: string;
    scheduledAt?: string;
    completedAt?: string;
    createdAt?: string;
};

export type EventValues = Record<string, unknown>;

export type EventData = EventValues & EventMain;

export type EventsData = EventData[];

export type EventsDataContainer = {
    all: EventsData;
    byStage: Record<string, EventsData>;
};

export type TEIValues = Record<string, unknown>;

export type Enrollment = {
    enrolledAt?: string;
    occurredAt?: string;
    enrollmentId?: string;
    programName?: string;
    enrollmentStatus?: string;
};

export type Option = {
    id: string;
    code: string;
    displayName: string;
};

export type OptionSet = {
    id: string;
    displayName: string;
    options: Option[];
};

export type OptionSets = Record<string, OptionSet>;

type Constant = {
    id: string;
    displayName: string;
    value: unknown;
};

export type Constants = Constant[];

export type VariableServiceInput = {
    programRuleVariables: ProgramRuleVariable[] | null;
    currentEvent?: EventData;
    otherEvents?: EventsData;
    dataElements: DataElements | null;
    selectedEntity: TEIValues | null;
    trackedEntityAttributes: TrackedEntityAttributes | null;
    selectedEnrollment: Enrollment | null;
    selectedOrgUnit: OrgUnit;
    optionSets: OptionSets;
    constants: Constants | null;
};

export type CompareDates = (firstRulesDate: string | null, secondRulesDate: string | null) => number;

export type OutputEffect = {
    type: typeof effectActions[keyof typeof effectActions];
    id: string;
    targetDataType?: typeof rulesEngineEffectTargetDataTypes[keyof typeof rulesEngineEffectTargetDataTypes];
    content?: string;
    name?: string;
    hadValue?: boolean;
};

export type OutputEffects = OutputEffect[];

export type AssignOutputEffect = OutputEffect & {
    value: unknown;
};

export type HideOutputEffect = OutputEffect;

export type HideProgramStageEffect = OutputEffect;

type ValidationMessage = {
    id: string;
    message: string;
};

export type GeneralErrorEffect = OutputEffect & {
    error: ValidationMessage;
};

export type GeneralWarningEffect = OutputEffect & {
    warning: ValidationMessage;
};

export type MessageEffect = OutputEffect & {
    message: string;
};

export type WarningEffects = MessageEffect[] | GeneralWarningEffect[];

export type ErrorEffects = MessageEffect[] | GeneralErrorEffect[];

export type CompulsoryEffect = OutputEffect;

type ProgramRuleData = {
    name: string;
    location: string | null;
    dataElementId: string | null;
    trackedEntityAttributeId: string | null;
    programStageId: string | null;
    programStageSectionId: string | null;
    optionGroupId: string | null;
    optionId: string | null;
    style?: Record<string, unknown> | null;
};

export type ProgramRuleEffect = {
    id: string;
    action: string;
    content: string | null;
    displayContent: string | null;
    data: unknown;
    field: string | null;
    attributeType: string | null;
} & ProgramRuleData;

export type ProgramRuleAction = {
    id: string;
    content: string;
    displayContent: string;
    data: string | null;
    programRuleActionType: string;
} & ProgramRuleData;

export type ProgramRule = {
    id: string;
    name: string;
    priority: number;
    condition: string;
    description?: string | null;
    displayName: string;
    programId: string;
    programStageId?: string | null;
    programRuleActions: ProgramRuleAction[];
};

export type ProgramRulesContainer = {
    programRuleVariables: ProgramRuleVariable[] | null;
    programRules: ProgramRule[] | null;
    constants?: Constants | null;
};

export type DataElement = {
    id: string;
    valueType: string;
    optionSetId?: string | null;
    name: string;
};

export type DataElements = Record<string | null, DataElement>;

export type RuleVariable = {
    variableValue: unknown;
    useCodeForOptionSet: boolean;
    variableType: string;
    hasValue: boolean;
    variableEventDate: string | null;
    variablePrefix: string;
    allValues: unknown[] | null;
};

export type RuleVariables = Record<string, RuleVariable>;

export type TrackedEntityAttribute = {
    id: string;
    valueType: string;
    optionSetId?: string | null;
    displayFormName: string;
    displayName: string;
};

export type TrackedEntityAttributes = Record<string | null, TrackedEntityAttribute>;

export type OrgUnitGroup = {
    readonly id: string;
    readonly name: string;
    readonly code: string;
};

export type OrgUnit = {
    readonly id: string;
    readonly name: string;
    readonly code: string;
    readonly groups: OrgUnitGroup[];
};

export type RulesEngineInput = {
    programRulesContainer: ProgramRulesContainer;
    currentEvent?: EventData | null;
    otherEvents?: EventsData;
    dataElements: DataElements;
    trackedEntityAttributes: TrackedEntityAttributes;
    selectedEntity: TEIValues;
    selectedEnrollment: Enrollment;
    selectedOrgUnit: OrgUnit;
    selectedUserRoles: string[];
    optionSets: OptionSets;
};

export type IConvertInputRulesValue = (value: unknown) => unknown;

export type IConvertOutputRulesEffectsValue = (value: unknown) => unknown;

export type Flag = {
    verbose?: boolean;
};
