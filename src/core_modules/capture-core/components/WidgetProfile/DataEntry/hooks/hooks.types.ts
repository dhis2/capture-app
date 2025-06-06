import type { RenderFoundation } from '../../../../metaData';
import type { 
    TrackedEntityAttributes, 
    OptionSets, 
    ProgramRulesContainer, 
    DataElements,
    OrgUnit
} from '../../../../rules/RuleEngine';
import type { QuerySingleResource } from '../../../../utils/api/api.types';
import type { DataEntryFormConfig } from '../../../DataEntries/common/TEIAndEnrollment';

export type Geometry = {
    coordinates: any;
};

export type StaticPatternValues = {
    orgUnitCode: string;
};

export type FormValuesParams = {
    foundation: RenderFoundation | null;
    clientAttributesWithSubvalues: Array<any>;
    staticPatternValues: StaticPatternValues;
    setFormValues: (values: any) => void;
    setClientValues: (values: any) => void;
    querySingleResource: QuerySingleResource;
};

export type UseFormValuesParams = {
    formFoundation: RenderFoundation;
    orgUnit: OrgUnit;
    clientAttributesWithSubvalues: Array<any>;
};

export type UseLifecycleParams = {
    programAPI: any;
    orgUnitId: string;
    clientAttributesWithSubvalues: Array<any>;
    userRoles: Array<string>;
    dataEntryId: string;
    itemId: string;
    geometry?: Geometry;
    dataEntryFormConfig?: DataEntryFormConfig;
};

export type UseGeometryValuesParams = {
    featureType: string;
    geometry?: Geometry;
};

export type ValidationMessages = {
    id: string;
    message: string;
}[];

export type ValidationResult = {
    errorsMessages: ValidationMessages;
    warningsMessages: ValidationMessages;
    formValidated: boolean;
};
