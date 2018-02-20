// @flow

type Constant = {
    id: string,
    displayName: string,
    value: any,
};

export type ProgramRulesContainer = {
    programRulesVariables: ?Array<ProgramRuleVariable>,
    programRules: ?Array<ProgramRule>,
    constants?: ?Array<Constant>,
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

export type EventsData = {
    [eventId: string]: EventData,
};

export type DataElement = {
    
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



