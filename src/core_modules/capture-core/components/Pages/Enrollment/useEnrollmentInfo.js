// @flow
import moment from 'moment';
import { useSelector } from 'react-redux';

const sortByDate = (enrollments = []) => enrollments.sort((a, b) =>
    moment.utc(b.enrollmentDate).diff(moment.utc(a.enrollmentDate)));


const getSuitableEnrollmentId = (enrollments) => {
    if (!enrollments) { return undefined; }
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

export const useEnrollmentInfo = (enrollmentId: string, programId: string) => {
    const enrollments = useSelector(({ enrollmentPage }) => enrollmentPage.enrollments);
    const tetId = useSelector(({ enrollmentPage }) => enrollmentPage.tetId);
    const programHasEnrollments = enrollments && enrollments.some(({ program }) => programId === program);
    const enrollmentsOnProgramContainEnrollmentId = enrollments && enrollments
        .filter(({ program }) => program === programId)
        .some(({ enrollment }) => enrollmentId === enrollment);
    const autoEnrollmentId = enrollmentId === 'AUTO' && getSuitableEnrollmentId(enrollments);

    return { programHasEnrollments, enrollmentsOnProgramContainEnrollmentId, tetId, autoEnrollmentId };
};

