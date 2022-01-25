// @flow
import type { OrgUnit } from 'capture-core-utils/rulesEngine';
import type { TrackerProgram } from 'capture-core/metaData';
import type {
    EnrollmentData,
    AttributeValue,
} from '../../../common/EnrollmentOverviewDomain/useCommonEnrollmentDomainData';

export type UseRuleEffectsInput = {|
    orgUnit?: ?OrgUnit,
    program: TrackerProgram,
    apiEnrollment?: EnrollmentData,
    apiAttributeValues?: Array<AttributeValue>,
|};
