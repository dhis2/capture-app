import { convertValue } from '../../converters/clientToView';
import { dataElementTypes } from '../../metaData/DataElement';

export const buildEnrollmentsAsOptions = (enrollments = [], selectedProgramId) =>
    enrollments
        .filter(({ program }) => program === selectedProgramId)
        .map(({ enrolledAt, enrollment }) => ({
            label: convertValue(enrolledAt, dataElementTypes.DATE),
            value: enrollment,
        }));
