// @flow
import { convertServerToClient } from '../../../converters';
import { dataElementTypes } from '../../../metaData';
import type {
    EnrollmentData,
} from '../../Pages/common/EnrollmentOverviewDomain/useCommonEnrollmentDomainData';

export const getEnrollmentForRulesEngine = ({ enrolledAt, occurredAt, enrollment }: EnrollmentData = {}): { enrollmentId: string, enrolledAt: string, occurredAt?: string } => ({
    enrollmentId: enrollment,
    // $FlowFixMe
    enrolledAt: convertServerToClient(enrolledAt, dataElementTypes.DATE),
    // $FlowFixMe
    occurredAt: convertServerToClient(occurredAt, dataElementTypes.DATE),
});
