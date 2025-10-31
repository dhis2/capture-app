import type { TrackerProgram } from 'capture-core/metaData';
import type {
    EnrollmentData,
    AttributeValue,
} from '../useCommonEnrollmentDomainData';

export type UseRuleEffectsInput = {
    orgUnit?: any;
    program: TrackerProgram;
    apiEnrollment?: EnrollmentData;
    apiAttributeValues?: Array<AttributeValue>;
    executionEnvironment?: string;
};
