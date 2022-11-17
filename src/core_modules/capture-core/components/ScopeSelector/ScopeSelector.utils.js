import { convertDateWithTimeForView } from '../../converters/clientToView';


export const buildEnrollmentsAsOptions = (enrollments = [], selectedProgramId) =>
    enrollments
        .filter(({ program }) => program === selectedProgramId)
        .map(({ enrolledAt, enrollment }) => ({
            label: convertDateWithTimeForView(enrolledAt),
            value: enrollment,
        }));
