// @flow
import { useSelector } from 'react-redux';
import moment from 'moment';

const sortByDate = (enrollments = []) => enrollments.sort((a, b) =>
    moment.utc(b.enrolledAt).diff(moment.utc(a.enrolledAt)));


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
    const sortedEnrollmentsByDate = sortByDate(enrollments);
    return sortedEnrollmentsByDate[0].enrollment;
};

export const useEnrollmentInfo = (enrollmentId: string, programId: string, teiId: string) => {
    const enrollments = useSelector(({ enrollmentPage }) => enrollmentPage.enrollments);
    const tetId = useSelector(({ enrollmentPage }) => enrollmentPage.tetId);
    const programHasEnrollments = enrollments && enrollments.some(({ program }) => programId === program);
    const enrollmentsOnProgramContainEnrollmentId = enrollments && enrollments
        .filter(({ program }) => program === programId)
        .some(({ enrollment }) => enrollmentId === enrollment);
    const enrollmentsInProgram = enrollments && enrollments.filter(({ program }) => program === programId);
    const autoEnrollmentId = enrollmentId === 'AUTO' && getSuitableEnrollmentId(enrollmentsInProgram, teiId);
    return { programHasEnrollments, enrollmentsOnProgramContainEnrollmentId, tetId, autoEnrollmentId };
};

