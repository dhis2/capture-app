import type {
    ProgramRuleVariable,
    EventData,
    EventsData,
    TEIValues,
    Enrollment,
    OptionSets,
    CompareDates,
    Constants,
} from './services/VariableService';
import { effectActions, rulesEngineEffectTargetDataTypes } from './constants';

export type OutputEffect = {
    type: typeof effectActions[keyof typeof effectActions],
    id: string,
    targetDataType?: typeof rulesEngineEffectTargetDataTypes[keyof typeof rulesEngineEffectTargetDataTypes],
    content?: string,
    name?: string,
    hadValue?: boolean,
};

export type DisplayTextEffect = OutputEffect & {
    displayText: string,
};

export type DisplayKeyValuePairEffect = OutputEffect & {
    displayKeyValuePair: { key: string, value: any },
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

export type ProgramRuleEffect = {
    id: string,
    location: string | null,
    action: string,
    dataElementId: string | null,
    trackedEntityAttributeId: string | null,
    programStageId: string | null,
    programStageSectionId: string | null,
    optionGroupId: string | null,
    optionId: string | null,
    content: string | null,
    displayContent: string | null,
    data: any,
    style?: any,
    name: string,
};

export type ProgramRuleAction = {
    id: string,
    content: string,
    displayContent: string,
    data: string | null,
    location: string | null,
    programRuleActionType: string,
    dataElementId?: string | null,
    programStageId?: string | null,
    programStageSectionId?: string | null,
    trackedEntityAttributeId?: string | null,
    optionGroupId?: string | null,
    optionId?: string | null,
    style?: any,
    name?: string,
};

export type ProgramRule = {
    id: string,
    name: string,
    priority?: number,
    condition: string,
    description?: string | null,
    displayName: string, // TODO: Refactor and remove
    programId: string,
    programStageId?: string | null,
    programRuleActions: Array<ProgramRuleAction>,
};

export type ProgramRulesContainer = {
    programRuleVariables: Array<ProgramRuleVariable> | null,
    programRules: Array<ProgramRule> | null,
    constants?: Constants | null,
};

export type DataElement = {
    id: string,
    valueType: string,
    optionSetId?: string | null,
    name: string,
};

export type DataElements = { [elementId: string]: DataElement };

export type RuleVariable = {
    variableValue: any,
    useCodeForOptionSet: boolean,
    variableType: string,
    hasValue: boolean,
    variableEventDate?: string | null,
    variablePrefix: string,
    allValues?: Array<any> | null,
};

export type RuleVariables = { [key: string]: RuleVariable };

export type TrackedEntityAttribute = {
    id: string,
    valueType: string,
    optionSetId?: string | null,
    displayFormName: string,
    displayName: string,
};

export type TrackedEntityAttributes = {
    [id: string]: TrackedEntityAttribute,
};

export type OrgUnitGroup = Readonly<{
    id: string,
    name: string,
    code: string,
}>;

export type OrgUnit = Readonly<{
    id: string,
    name: string,
    code: string,
    groups: Array<OrgUnitGroup>,
}>;

export type RulesEngineInput = {
    programRulesContainer: ProgramRulesContainer,
    currentEvent?: EventData | null,
    otherEvents?: EventsData | null,
    dataElements: DataElements | null,
    selectedEntity?: TEIValues | null,
    trackedEntityAttributes?: TrackedEntityAttributes | null,
    selectedEnrollment?: Enrollment | null,
    selectedOrgUnit: OrgUnit | null,
    selectedUserRoles?: Array<string> | null,
    optionSets: OptionSets,
};

export type Translator = (value: string) => string;

export type IDateUtils = {
    getToday(): string,
    daysBetween(firstRulesDate: string | null, secondRulesDate: string | null): number | null,
    weeksBetween(firstRulesDate: string | null, secondRulesDate: string | null): number | null,
    monthsBetween(firstRulesDate: string | null, secondRulesDate: string | null): number | null,
    yearsBetween(firstRulesDate: string | null, secondRulesDate: string | null): number | null,
    readonly compareDates: CompareDates,
    addDays(rulesDate: string | null, daysToAdd: number): string | null,
};

export type IConvertInputRulesValue = {
    convertText(value: any): string | null,
    convertMultiText(value: any): string | null,
    convertLongText(value: any): string | null,
    convertLetter(value: any): string | null,
    convertPhoneNumber(value: any): string | null,
    convertEmail(value: any): string | null,
    convertBoolean(value: any): boolean | null,   // Yes/No
    convertTrueOnly(value: any): boolean | null,  // Yes Only
    convertDate(value: any): string | null,
    convertDateTime(value: any): string | null,
    convertTime(value: any): string | null,
    convertNumber(value: any): number | null,
    convertUnitInterval(value: any): number | null,
    convertPercentage(value: any): number | null,
    convertInteger(value: any): number | null,
    convertIntegerPositive(value: any): number | null,
    convertIntegerNegative(value: any): number | null,
    convertIntegerZeroOrPositive(value: any): number | null,
    convertTrackerAssociate(value: any): string | null,
    convertUserName(value: any): string | null,
    convertCoordinate(value: any): string | null,
    convertOrganisationUnit(value: any): string | null,
    convertAge(value: any): string | null,
    convertUrl(value: any): string | null,
    convertFile(value: any): string | null,
    convertImage(value: any): string | null,
};

export type IConvertOutputRulesEffectsValue = {
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
};

export type Flag = {
    verbose: boolean,
};
