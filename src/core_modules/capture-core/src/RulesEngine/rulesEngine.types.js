// @flow
export type ProgramRuleAction = {
    content: string,
    data: string,
    location: string,
    programRuleActionType: string,
    dataElement?: {
        id?: ?string,
    },
    programStage?: {
        id?: ?string,
    },
    programStageSection?: {
        id?: ?string,
    },
    trackedEntityAttribute?: {
        id?: ?string,
    }
};

export type ProgramRule = {
    id: string,
    condition: string,
    description?: ?string,
    displayName: string,
    program: {
        id: string,
    },
    programRuleActions: Array<ProgramRuleAction>,
};


export type ProgramRuleVariable = {
    displayName: string,
    programRuleVariableSourceType: string,
    program: {
        id: string,
    },
    dataElement?: {
        id?: ?string,
    },
    trackedEntityAttribute?: {
        id?: ?string,
    },
    programStage?: {
        id?: ?string,
    },
    useNameForOptionSet: boolean,
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

export type Entity = {

};

export type Enrollment = {

};

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



