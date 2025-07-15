import { convertServerToClient } from '../../../converters';
import { dataElementTypes, getTrackerProgramThrowIfNotFound } from '../../../metaData';
import type {
    EnrollmentData,
} from '../../Pages/common/EnrollmentOverviewDomain/useCommonEnrollmentDomainData';

export const getEnrollmentForRulesEngine = ({
    enrolledAt,
    occurredAt,
    enrollment,
    status,
    program,
}: EnrollmentData = {}): {
    enrollmentId: string,
    enrolledAt: string,
    occurredAt?: string,
    enrollmentStatus: string,
    programName: string,
} => ({
    enrollmentId: enrollment,
    enrolledAt: convertServerToClient(enrolledAt, dataElementTypes.DATE),
    occurredAt: convertServerToClient(occurredAt, dataElementTypes.DATE),
    enrollmentStatus: status,
    programName: getTrackerProgramThrowIfNotFound(program).name,
});
