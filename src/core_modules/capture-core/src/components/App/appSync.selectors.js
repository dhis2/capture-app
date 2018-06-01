// @flow
import { createSelector } from 'reselect';

const programIdSelector = state => state.currentSelections.programId;
const orgUnitIdSelector = state => state.currentSelections.orgUnitId;
const eventIdSelector = state => state.editEventPage.eventId;

export const paramsSelector = createSelector(
    programIdSelector,
    orgUnitIdSelector,
    eventIdSelector,
    (programId: ?string, orgUnitId: ?string, eventId: ?string) => ({
        programId,
        orgUnitId,
        eventId,
    }),
);
