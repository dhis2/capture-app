import { convertValue } from '../../converters/clientToView';
import { dataElementTypes } from '../../metaData/DataElement';

export const buildEnrollmentsAsOptions = (enrollments = [], selectedProgramId) =>
    enrollments
        .filter(({ program }) => program === selectedProgramId)
        .map(({ enrollmentDate, enrollment }) => ({
            label: convertValue(enrollmentDate, dataElementTypes.DATETIME),
            value: enrollment,
        }));
