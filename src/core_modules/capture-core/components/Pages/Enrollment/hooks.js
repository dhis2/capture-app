// @flow
import { useSelector } from 'react-redux';

export const useEnrollmentInfo = (enrollmentId: string, programId: string) => {
    const enrollments: ?Array<Object> = useSelector(({ enrollmentPage }) => enrollmentPage.enrollments);
    const tetId = useSelector(({ enrollmentPage }) => enrollmentPage.tetId);
    const programHasEnrollments =
      Array.isArray(enrollments) ?
          enrollments
              .some(({ program }) => programId === program)
          : null;

    const enrollmentsOnProgramContainEnrollmentId =
      Array.isArray(enrollments) ?
          enrollments
              .filter(({ program }) => program === programId)
              .some(({ enrollment }) => enrollmentId === enrollment)
          : null;

    return { programHasEnrollments, enrollmentsOnProgramContainEnrollmentId, tetId };
};
