import type { QuerySingleResource } from '../../../../utils/api/api.types';
import type { dataElementTypes, RenderFoundation } from '../../../../metaData';
import type {
    ProgramRulesContainer,
    EventsData,
    DataElements,
    TEIValues,
    OrgUnit,
    TrackedEntityAttributes,
    OptionSets,
} from '../../../../rules/RuleEngine';

export type EnrollmentData = {
    enrollment: string;
    enrolledAt: string;
    occurredAt: string;
    status: string;
};

export type GeometryValues = {
    FEATURETYPE: string;
    DATAELEMENTTYPE: string;
    LABEL: string;
};

export type ProgramAttributeData = {
    attribute: string;
    value: string;
    valueType: keyof typeof dataElementTypes;
    optionSet?: {
        options: Array<{
            name: string;
            code: string;
            displayName: string;
        }>
    };
};

export type BuildRulesContainerParams = {
    programAPI: any;
    programRules: Array<any>;
    constants: Array<any>;
    setRulesContainer: (rulesContainer: ProgramRulesContainer) => void;
};

export type GetRulesActionsParams = {
    foundation: RenderFoundation;
    formId: string;
    orgUnit: OrgUnit;
    enrollmentData?: EnrollmentData;
    teiValues?: TEIValues | null;
    trackedEntityAttributes: TrackedEntityAttributes | null;
    optionSets: OptionSets;
    rulesContainer: ProgramRulesContainer;
    otherEvents?: EventsData | null;
    dataElements: DataElements | null;
    userRoles: Array<string>;
    programName: string;
};

export type GetRulesActionsAsyncParams = GetRulesActionsParams & {
    querySingleResource: QuerySingleResource;
    onGetValidationContext: () => Record<string, unknown>;
};

export type RequestedEntitiesType = {
    events: string;
    trackedEntities: string;
    relationships: string;
};
