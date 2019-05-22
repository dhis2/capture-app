// @flow
import { createSelector } from 'reselect';
import { getProgramAndStageFromProgramId } from '../../metaData/helpers/EventProgram';

const programIdSelector = state => state.currentSelections.programId;
const orgUnitIdSelector = state => state.currentSelections.orgUnitId;
const orgUnitsSelector = state => state.organisationUnits;

// $FlowFixMe
export const makeProgramAndStageContainerSelector = () => createSelector(
    programIdSelector,
    (programId: ?string) => (programId ? getProgramAndStageFromProgramId(programId) : null));

// $FlowFixMe
export const makeOrgUnitSelector = () => createSelector(
    orgUnitIdSelector,
    orgUnitsSelector,
    (orgUnitId: ?string, orgUnits: any) => (orgUnitId && orgUnits ? orgUnits[orgUnitId] : null));