import { convertValue } from '../../converters/clientToView';
import { dataElementTypes } from '../../metaData/DataElement';

export const buildEnrollmentsAsOptions = (enrollments = [], selectedProgramId) =>
    enrollments
        .filter(({ program }) => program === selectedProgramId)
        .map(({ created, enrollment }) => ({
            label: convertValue(created, dataElementTypes.DATETIME),
            value: enrollment,
        }));
