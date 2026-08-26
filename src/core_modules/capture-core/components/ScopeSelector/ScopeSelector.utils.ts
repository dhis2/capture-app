import { convertDateWithTimeForView } from '../../converters/clientToView';

type Enrollment = {
    program: string;
    enrolledAt: string;
    enrollment: string;
};

type EnrollmentOption = {
    label: string;
    value: string;
};

export const buildEnrollmentsAsOptions = (enrollments: Enrollment[] = [], selectedProgramId: string): EnrollmentOption[] =>
    enrollments
        .filter(({ program }) => program === selectedProgramId)
        .map(({ enrolledAt, enrollment }) => ({
            label: convertDateWithTimeForView(enrolledAt),
            value: enrollment,
        }));
