import { convertValue } from '../../converters/clientToView';
import { dataElementTypes } from '../../metaData/DataElement';

export const buildEnrollmentsAsOptions = (enrollments = [], selectedProgramId) =>
    enrollments
        .filter(({ program }) => program === selectedProgramId)
        .map(({ createdAt, enrollment }) => ({
            label: convertValue(createdAt, dataElementTypes.DATETIME),
            value: enrollment,
        }));
