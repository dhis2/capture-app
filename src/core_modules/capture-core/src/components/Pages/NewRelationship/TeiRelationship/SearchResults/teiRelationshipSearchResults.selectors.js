// @flow
import { createSelector } from 'reselect';
import { getTrackerProgramThrowIfNotFound, getTrackedEntityTypeThrowIfNotFound } from '../../../../../metaData';
import errorCreator from '../../../../../utils/errorCreator';
import chunk from '../../../../../utils/chunk';

const trackedEntityTypeIdSelector = props => props.selectedTrackedEntityTypeId;
const programIdSelector = props => props.selectedProgramId;

const makeAttributesSelector = () => createSelector(
    programIdSelector,
    trackedEntityTypeIdSelector,
    (programId: ?string, trackedEntityTypeId: string) => {
        if (programId) {
            const program = getTrackerProgramThrowIfNotFound(programId);
            return program.attributes.filter(a => a.displayInReports);
        }
        const tet = getTrackedEntityTypeThrowIfNotFound(trackedEntityTypeId);
        return tet.attributes.filter(a => a.displayInReports);
    },
);

export default makeAttributesSelector;

