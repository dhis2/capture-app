// @flow
import { useSelector } from 'react-redux';
import { programCollection } from '../../../metaDataMemoryStores';

const getSuitableEnrollmentId = (enrollments, teiId) => {
    if (!enrollments) {
        return undefined;
    }

    if (teiId) {
        enrollments = enrollments.filter(enrollment => enrollment.trackedEntity === teiId);
    }

    if (!enrollments.length) {
        return undefined;
    }

    if (enrollments.length === 1) {
        return enrollments[0].enrollment;
    }

    const activeEnrollments = enrollments.filter(enrollment => enrollment.status === 'ACTIVE');
    if (activeEnrollments.length) {
        return activeEnrollments[0].enrollment;
    }

    return undefined;
};

export const useEnrollmentInfo = (enrollmentId: string, programId: string, teiId: string) => {
    const { enrollments, tetId } = useSelector(({ enrollmentPage }) => enrollmentPage);
    const programHasEnrollments = enrollments && enrollments.length > 0;
    const programHasActiveEnrollments = programHasEnrollments && enrollments
        .some(({ status }) => status === 'ACTIVE');
    const enrollmentsOnProgramContainEnrollmentId = enrollments && enrollments
        .some(({ enrollment }) => enrollmentId === enrollment);
    const onlyEnrollOnce = programId && programCollection.get(programId)?.onlyEnrollOnce;
    const enrollmentsInProgram = enrollments && enrollments.filter(({ program }) => program === programId);
    const autoEnrollmentId = enrollmentId === 'AUTO' && getSuitableEnrollmentId(enrollmentsInProgram, teiId);
    return {
        programHasEnrollments,
        programHasActiveEnrollments,
        enrollmentsOnProgramContainEnrollmentId,
        onlyEnrollOnce,
        tetId,
        autoEnrollmentId,
    };
};
