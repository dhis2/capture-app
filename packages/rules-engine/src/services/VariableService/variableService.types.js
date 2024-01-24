// @flow
import { typeof eventStatuses } from './constants';
import type { DataElements, TrackedEntityAttributes, OrgUnit } from '../../rulesEngine.types';

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
