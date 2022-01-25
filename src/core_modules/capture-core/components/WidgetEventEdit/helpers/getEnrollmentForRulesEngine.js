// @flow
import { convertServerToClient } from '../../../converters';
import { dataElementTypes } from '../../../metaData';
import type {
    EnrollmentData,
} from '../../Pages/common/EnrollmentOverviewDomain/useCommonEnrollmentDomainData';

export const getEnrollmentForRulesEngine = ({ enrollmentDate, incidentDate, enrollment }: EnrollmentData = {}): { enrollmentId: string, enrollmentDate: string, incidentDate?: string } => ({
    enrollmentId: enrollment,
    // $FlowFixMe
    enrollmentDate: convertServerToClient(enrollmentDate, dataElementTypes.DATE),
    // $FlowFixMe
    incidentDate: convertServerToClient(incidentDate, dataElementTypes.DATE),
});
