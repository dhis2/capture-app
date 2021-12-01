import { dataElementTypes } from '../../metaData/DataElement';
import { convertValue } from '../../converters/clientToView';

export const buildEnrollmentsAsOptions = (enrollments = [], selectedProgramId) =>
    enrollments
        .filter(({ program }) => program === selectedProgramId)
        .map(({ created, enrollment }) => ({
            label: convertValue(created, dataElementTypes.DATETIME),
            value: enrollment,
        }));
