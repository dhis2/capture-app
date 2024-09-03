// @flow
import {
    typeof effectActions,
    typeof eventStatuses,
    typeof rulesEngineEffectTargetDataTypes,
} from '../constants';

export type ProgramRuleVariable = {
    id: string,
    displayName: string,
    programRuleVariableSourceType: string,
    valueType: string,
    programId: string,
    dataElementId?: ?string,
    trackedEntityAttributeId?: ?string,
    programStageId?: ?string,
    useNameForOptionSet?: ?boolean,
};

type EventMain = {
    +eventId?: string,
    +programId?: string,
    +programStageId?: string,
    +programStageName?: string,
    +orgUnitId?: string,
    +trackedEntityInstanceId?: string,
    +enrollmentId?: string,
    +enrollmentStatus?: string,
    +status?: $Values<eventStatuses>,
    +occurredAt?: string,
    +scheduledAt?: string,
    +completedAt?: string,
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
    +enrolledAt?: string,
    +occurredAt?: string,
    +enrollmentId?: string,
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

export type OptionSets = {|
    [id: string]: OptionSet,
|};

type Constant = {|
    id: string,
    displayName: string,
    value: any,
|};

export type Constants = Array<Constant>;

export type VariableServiceInput = {|
    programRuleVariables: ?Array<ProgramRuleVariable>,
    currentEvent?: EventData,
    otherEvents?: EventsData,
    dataElements: ?DataElements,
    selectedEntity: ?TEIValues,
    trackedEntityAttributes: ?TrackedEntityAttributes,
    selectedEnrollment: ?Enrollment,
    selectedOrgUnit: OrgUnit,
    optionSets: OptionSets,
    constants: ?Constants,
|};

export type CompareDates = (firstRulesDate: ?string, secondRulesDate: ?string) => number;


export type OutputEffect = {
    type: $Values<effectActions>,
    id: string,
    targetDataType?: $Values<rulesEngineEffectTargetDataTypes>,
    content?: string,
    name?: string,
    hadValue?: boolean,
};

export type OutputEffects = Array<OutputEffect>;

export type AssignOutputEffect = OutputEffect & {
    value: any,
};

export type HideOutputEffect = OutputEffect & {

};

export type HideProgramStageEffect = OutputEffect & {

};

export type MessageEffect = OutputEffect & {
    message: string,
};

export type GeneralErrorEffect = OutputEffect & {
    error: { id: string, message: string },
};

export type GeneralWarningEffect = OutputEffect & {
    warning: { id: string, message: string },
};

export type CompulsoryEffect = OutputEffect & {

};

type ProgramRuleData = {
    name: string,
    location: ?string,
    dataElementId: ?string,
    trackedEntityAttributeId: ?string,
    programStageId: ?string,
    programStageSectionId: ?string,
    optionGroupId: ?string,
    optionId: ?string,
    style?: ?Object,
};

export type ProgramRuleEffect = {
    id: string,
    action: string,
    content: ?string,
    displayContent: ?string,
    data: any,
    ...ProgramRuleData,
};

export type ProgramRuleAction = {
    id: string,
    content: string,
    displayContent: string,
    data: ?string,
    programRuleActionType: string,
    ...ProgramRuleData,
};

export type ProgramRule = {
    id: string,
    name: string,
    priority: number,
    condition: string,
    description?: ?string,
    displayName: string, // TODO: Refactor and remove
    programId: string,
    programStageId?: ?string,
    programRuleActions: Array<ProgramRuleAction>,
};

export type ProgramRulesContainer = {
    programRuleVariables: ?Array<ProgramRuleVariable>,
    programRules: ?Array<ProgramRule>,
    constants?: ?Constants,
};

export type DataElement = {
    id: string,
    valueType: string,
    optionSetId?: ?string,
    name: string,
};

export type DataElements = { [elementId: string]: DataElement };

export type RuleVariable = {
    variableValue: any,
    useCodeForOptionSet: boolean,
    variableType: string,
    hasValue: boolean,
    variableEventDate: ?string,
    variablePrefix: string,
    allValues: ?Array<any>,
};

export type RuleVariables = { [string]: RuleVariable };

export type TrackedEntityAttribute = {
    id: string,
    valueType: string,
    optionSetId?: ?string,
    displayFormName: string,
    displayName: string,
};

export type TrackedEntityAttributes = {
    [id: string]: TrackedEntityAttribute
};

export type OrgUnitGroup = $ReadOnly<{|
    id: string,
    name: string,
    code: string,
|}>;

export type OrgUnit = $ReadOnly<{
    id: string,
    name: string,
    code: string,
    groups: Array<OrgUnitGroup>,
}>;

export type RulesEngineInput = {|
    programRulesContainer: ProgramRulesContainer,
    currentEvent?: ?EventData,
    otherEvents?: ?EventsData,
    dataElements: ?DataElements,
    selectedEntity?: ?TEIValues,
    trackedEntityAttributes?: ?TrackedEntityAttributes,
    selectedEnrollment?: ?Enrollment,
    selectedOrgUnit: OrgUnit,
    selectedUserRoles?: ?Array<string>,
    optionSets: OptionSets,
|}

export type Translator = (value: string) => string;

export type IDateUtils = {|
    getToday(): string,
    daysBetween(firstRulesDate: ?string, secondRulesDate: ?string): ?number,
    weeksBetween(firstRulesDate: ?string, secondRulesDate: ?string): ?number,
    monthsBetween(firstRulesDate: ?string, secondRulesDate: ?string): ?number,
    yearsBetween(firstRulesDate: ?string, secondRulesDate: ?string): ?number,
    +compareDates: CompareDates,
    addDays(rulesDate: ?string, daysToAdd: number): ?string,
|};

export type IConvertInputRulesValue = {|
    convertText(value: any): ?string,
    convertMultiText(value: any): ?string,
    convertLongText(value: any): ?string,
    convertLetter(value: any): ?string,
    convertPhoneNumber(value: any): ?string,
    convertEmail(value: any): ?string,
    convertBoolean(value: any): ?boolean,   // Yes/No
    convertTrueOnly(value: any): ?boolean,  // Yes Only
    convertDate(value: any): ?string,
    convertDateTime(value: any): ?string,
    convertTime(value: any): ?string,
    convertNumber(value: any): ?number,
    convertUnitInterval(value: any): ?number,
    convertPercentage(value: any): ?number,
    convertInteger(value: any): ?number,
    convertIntegerPositive(value: any): ?number,
    convertIntegerNegative(value: any): ?number,
    convertIntegerZeroOrPositive(value: any): ?number,
    convertTrackerAssociate(value: any): ?string,
    convertUserName(value: any): ?string,
    convertCoordinate(value: any): ?string,
    convertOrganisationUnit(value: any): ?string,
    convertAge(value: any): ?string,
    convertUrl(value: any): ?string,
    convertFile(value: any): ?string,
    convertImage(value: any): ?string,
|};

export type IConvertOutputRulesEffectsValue = {|
    convertText(value: string): any,
    convertMultiText(value: string): any,
    convertLongText(value: string): any,
    convertLetter(value: string): any,
    convertPhoneNumber(value: string): any,
    convertEmail(value: string): any,
    convertBoolean(value: boolean): any,   // Yes/No
    convertTrueOnly(value: boolean): any,  // Yes Only
    convertDate(value: string): any,
    convertDateTime(value: string): any,
    convertTime(value: string): any,
    convertNumber(value: number): any,
    convertUnitInterval(value: number): any,
    convertPercentage(value: number): any,
    convertInteger(value: number): any,
    convertIntegerPositive(value: number): any,
    convertIntegerNegative(value: number): any,
    convertIntegerZeroOrPositive(value: number): any,
    convertTrackerAssociate(value: string): any,
    convertUserName(value: string): any,
    convertCoordinate(value: string): any,
    convertOrganisationUnit(value: string): any,
    convertUrl(value: string): any,
    convertAge(value: string): any,
    convertFile(value: string): any,
    convertImage(value: string): any,
|};

export type Flag = {
    verbose: boolean,
}
