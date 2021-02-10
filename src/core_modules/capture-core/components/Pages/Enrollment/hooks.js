import { useSelector } from 'react-redux';

export const useEnrollmentInfo = (enrollmentId: string, programId: string) => {
    const enrollments: Object = useSelector(({ enrollmentPage }) => enrollmentPage.enrollments);
    const programHasEnrollments = enrollments && enrollments.some(({ program }) => programId === program);
    const enrollmentsOnProgramContainEnrollmentId = enrollments && enrollments
        .filter(({ program }) => program === programId)
        .some(({ enrollment }) => enrollmentId === enrollment);

    return { programHasEnrollments, enrollmentsOnProgramContainEnrollmentId };
};
