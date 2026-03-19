import { createSelector } from 'reselect';
import { getTrackerProgramThrowIfNotFound, getTrackedEntityTypeThrowIfNotFound } from '../../../../../metaData';

const trackedEntityTypeIdSelector = (props: any) => props.selectedTrackedEntityTypeId;
const programIdSelector = (props: any) => props.selectedProgramId;

export const makeAttributesSelector = () => createSelector(
    programIdSelector,
    trackedEntityTypeIdSelector,
    (programId?: string, trackedEntityTypeId?: string) => {
        if (programId) {
            const program = getTrackerProgramThrowIfNotFound(programId);
            return program.attributes.filter((a: any) => a.displayInReports);
        }
        if (trackedEntityTypeId) {
            const tet = getTrackedEntityTypeThrowIfNotFound(trackedEntityTypeId);
            return tet.attributes.filter((a: any) => a.displayInReports);
        }
        return [];
    },
);
