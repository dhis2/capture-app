// @flow
import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import type { TrackerProgram } from 'capture-core/metaData';
import type {
    EnrollmentData,
    AttributeValue,
} from '../useCommonEnrollmentDomainData';

export type UseRuleEffectsInput = {|
    orgUnit?: ?OrgUnit,
    program: TrackerProgram,
    apiEnrollment?: EnrollmentData,
    apiAttributeValues?: Array<AttributeValue>,
|};
