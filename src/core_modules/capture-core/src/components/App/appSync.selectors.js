// @flow
import { createSelector } from 'reselect';

const programIdSelector = state => state.currentSelections.programId;
const orgUnitIdSelector = state => state.currentSelections.orgUnitId;
const viewEventIdSelector = state => state.viewEventPage.eventId;
const eventIdSelector = state => state.editEventPage.eventId;

export const paramsSelector = createSelector(
    programIdSelector,
    orgUnitIdSelector,
    eventIdSelector,
    viewEventIdSelector,
    (programId: ?string, orgUnitId: ?string, eventId: ?string, viewEventId: ?string) => ({
        programId,
        orgUnitId,
        eventId,
        viewEventId,
    }),
);
