import { useSelector } from 'react-redux';
import { programCollection } from '../../../metaDataMemoryStores';

const getSuitableEnrollmentId = (enrollments: any, teiId: string) => {
    if (!enrollments) {
        return undefined;
    }

    if (teiId) {
        enrollments = enrollments.filter((enrollment: any) => enrollment.trackedEntity === teiId);
    }

    if (!enrollments.length) {
        return undefined;
    }

    if (enrollments.length === 1) {
        return enrollments[0].enrollment;
    }

    const activeEnrollments = enrollments.filter((enrollment: any) => enrollment.status === 'ACTIVE');
    if (activeEnrollments.length) {
        return activeEnrollments[0].enrollment;
    }

    return undefined;
};

export const useEnrollmentInfo = (enrollmentId: string, programId: string, teiId: string) => {
    const { enrollments, tetId } = useSelector(({ enrollmentPage }: any) => enrollmentPage);
    const programHasEnrollments = enrollments && enrollments.length > 0;
    const programHasActiveEnrollments = programHasEnrollments && enrollments
        .some(({ status }: any) => status === 'ACTIVE');
    const enrollmentsOnProgramContainEnrollmentId = enrollments && enrollments
        .some(({ enrollment }: any) => enrollmentId === enrollment);
    const onlyEnrollOnce = programId && programCollection.get(programId)?.onlyEnrollOnce;
    const enrollmentsInProgram = enrollments && 
        enrollments.filter(({ program }: any) => program === programId);
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
