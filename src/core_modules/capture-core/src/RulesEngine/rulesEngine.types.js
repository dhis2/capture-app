// @flow
export type ProgramRuleEffect = {
    id: string,
    location: ?string,
    action: string,
    dataElementId: ?string,
    trackedEntityAttributeId: ?string,
    programStageId: ?string,
    programStageSectionId: ?string,
    content: string,
    data: ?string,
    ineffect: boolean,
};

export type ProgramRuleAction = {
    id: string,
    content: string,
    data: ?string,
    location: ?string,
    programRuleActionType: string,
    dataElementId?: ?string,
    programStageId?: ?string,
    programStageSectionId?: ?string,
    trackedEntityAttributeId?: ?string,
};

export type ProgramRule = {
    id: string,
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
    programRulesVariables: Array<ProgramRuleVariable>,
    programRules: Array<ProgramRule>,
    constants?: ?Constants,
};

type EventMain = {
    eventId: string,
    programId: string,
    programStageId: string,
    orgUnitId: string,
    orgUnitName: string,
    trackedEntityInstanceId: string,
    enrollmentId: string,
    enrollmentStatus: string,
    status: string,
    eventDate: string,
    dueDate: string,
};

type EventValues = {
    [elementId: string]: any,
};

export type EventData = EventMain & EventValues;

export type EventsData = Array<EventData>;

export type EventsDataContainer = {
    all: EventsData,
    byStage: { [stageId: string]: EventsData },
};

export type DataElement = {
    id: string,
    valueType: string,
    optionSetId: string,
};

export type DataElements = { [elementId: string]: DataElement };

type TrackedEntityAttribute = {

};

export type TrackedEntityAttributes = {
    [id: string]: TrackedEntityAttribute
};

type Attribute = {
    id: string,
    value: any,
};

export type Entity = {
    attributes: Array<Attribute>,
};

export type Enrollment = {
    enrollmentDate: string,
};

export type OrgUnit = {
    id: string,
    code: string,
};

export type Translator = (value: string) => string;

export type Moment = Object;
export interface IMomentConverter {
    rulesDateToMoment(rulesEngineValue: string): Moment;
    momentToRulesDate(momentValue: Moment): string;
}

export interface IConvertRulesValue {
    convertText(value: any): string;
    convertLongText(value: any): string;
    convertLetter(value: any): string;
    convertPhoneNumber(value: any): string;
    convertEmail(value: any): string;
    convertBoolean(value: any): boolean;
    convertTrueOnly(value: any): boolean;
    convertDate(value: any): string;
    convertDateTime(value: any): string;
    convertTime(value: any): string;
    convertNumber(value: any): number;
    convertInteger(value: any): number;
    convertIntegerPositive(value: any): number;
    convertIntegerNegative(value: any): number;
    convertIntegerZeroOrPositive(value: any): number;
    convertPercentage(value: any): number;
    convertUrl(value: any): string;
}



