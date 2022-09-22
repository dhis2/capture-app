// @flow
import { typeof effectActions } from './effectActions.const';

export type OutputEffect = {
    type: $Values<effectActions>,
    id: string,
};

export type OutputEffects = Array<OutputEffect>;

export type AssignOutputEffect = OutputEffect & {
    value: any,
};

export type HideOutputEffect = OutputEffect & {

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
    location: ?string,
    action: string,
    dataElementId: ?string,
    trackedEntityAttributeId: ?string,
    programStageId: ?string,
    programStageSectionId: ?string,
    optionGroupId: ?string,
    optionId: ?string,
    content: ?string,
    data: any,
};

export type ProgramRuleAction = {
    id: string,
    content: string,
    displayContent: string,
    data: ?string,
    location: ?string,
    programRuleActionType: string,
    dataElementId?: ?string,
    programStageId?: ?string,
    programStageSectionId?: ?string,
    trackedEntityAttributeId?: ?string,
    optionGroupId: ?string,
    optionId: ?string,
};

export type ProgramRule = {
    id: string,
    name: string;
    priority: number;
    condition: string,
    description?: ?string,
    displayName: string,
    programId: string,
    programStageId?: ?string,
    programRuleActions: Array<ProgramRuleAction>,
};

export type ProgramRuleVariable = {
    id: string,
    displayName: string,
    programRuleVariableSourceType: string,
    programId: string,
    dataElementId?: ?string,
    trackedEntityAttributeId?: ?string,
    programStageId?: ?string,
    useNameForOptionSet?: ?boolean,
};

type Option = {
    code: string,
    displayName: string,
    id: string,
};

export type OptionSet = {
    id: string,
    displayName: string,
    options: Array<Option>,
};

export type OptionSets = {
    [id: string]: OptionSet
}

type Constant = {
    id: string,
    displayName: string,
    value: any,
};

export type Constants = Array<Constant>;

export type ProgramRulesContainer = {
    programRulesVariables: ?Array<ProgramRuleVariable>,
    programRules: ?Array<ProgramRule>,
    constants?: ?Constants,
};

type EventMain = {
    eventId?: string,
    programId?: string,
    programStageId?: string,
    orgUnitId?: string,
    orgUnitName?: string,
    trackedEntityInstanceId?: string,
    enrollmentId?: string,
    enrollmentStatus?: string,
    status?: string,
    eventDate?: string,
    dueDate?: string,
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

export type DataElement = {
    id: string,
    valueType: string,
    optionSetId?: ?string,
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
};

export type TrackedEntityAttributes = {
    [id: string]: TrackedEntityAttribute
};

export type Enrollment = {
    enrollmentDate?: ?string,
    incidentDate?: ?string,
    enrollmentId?: ?string,
};

export type TEIValues = {
    [attributeId: string]: any,
};

export type OrgUnit = {
    id: string,
    name: string,
};

export type Moment = Object;
export interface IMomentConverter {
    rulesDateToMoment(rulesEngineValue: string): Moment;
    momentToRulesDate(momentValue: Moment): string;
}

export type Translator = (value: string) => string;

export interface IConvertInputRulesValue {
    convertText(value: any): string;
    convertLongText(value: any): string;
    convertLetter(value: any): string;
    convertPhoneNumber(value: any): string;
    convertEmail(value: any): string;
    convertBoolean(value: any): boolean | string;
    convertTrueOnly(value: any): boolean | string;
    convertDate(value: any): string;
    convertDateTime(value: any): string;
    convertTime(value: any): string;
    convertNumber(value: any): number | string;
    convertInteger(value: any): number | string;
    convertIntegerPositive(value: any): number | string;
    convertIntegerNegative(value: any): number | string;
    convertIntegerZeroOrPositive(value: any): number | string;
    convertPercentage(value: any): number | string;
    convertUrl(value: any): string;
    convertAge(value: any): number | string;
}

export interface IConvertOutputRulesEffectsValue {
    convertText(value: string): any;
    convertLongText(value: string): any;
    convertLetter(value: string): any;
    convertPhoneNumber(value: string): any;
    convertEmail(value: string): any;
    convertBoolean(value: boolean): any;
    convertTrueOnly(value: boolean): any;
    convertDate(value: string): any;
    convertDateTime(value: string): any;
    convertTime(value: string): any;
    convertNumber(value: number): any;
    convertInteger(value: number): any;
    convertIntegerPositive(value: number): any;
    convertIntegerNegative(value: number): any;
    convertIntegerZeroOrPositive(value: number): any;
    convertPercentage(value: number): any;
    convertUrl(value: string): any;
    convertAge(value: string): any;
}

export type D2FunctionConfig = {
    parameters?: number,
    execute: Function,
}
export type D2Functions = $ReadOnly<{|
    ceil: D2FunctionConfig,
    floor: D2FunctionConfig,
    round: D2FunctionConfig,
    modulus: D2FunctionConfig,
    zing: D2FunctionConfig,
    oizp: D2FunctionConfig,
    concatenate: D2FunctionConfig,
    daysBetween: D2FunctionConfig,
    weeksBetween: D2FunctionConfig,
    monthsBetween: D2FunctionConfig,
    yearsBetween: D2FunctionConfig,
    addDays: D2FunctionConfig,
    count: D2FunctionConfig,
    countIfValue: D2FunctionConfig,
    countIfZeroPos: D2FunctionConfig,
    hasValue: D2FunctionConfig,
    validatePattern: D2FunctionConfig,
    left: D2FunctionConfig,
    right: D2FunctionConfig,
    substring: D2FunctionConfig,
    split: D2FunctionConfig,
    length: D2FunctionConfig,
    zScoreWFA: D2FunctionConfig,
    lastEventDate: D2FunctionConfig,
    addControlDigits: D2FunctionConfig,
    checkControlDigits: D2FunctionConfig,
    zScoreHFA: D2FunctionConfig,
    zScoreWFH: D2FunctionConfig,
|}>;

export type Flag = {
    debug: boolean
}
