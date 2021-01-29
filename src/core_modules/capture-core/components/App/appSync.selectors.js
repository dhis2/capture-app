// @flow
import { createSelector } from 'reselect';

const programIdSelector = state => state.currentSelections.programId;
const trackedEntityTypeIdSelector = state => state.currentSelections.trackedEntityTypeId;
const orgUnitIdSelector = state => state.currentSelections.orgUnitId;
const viewEventIdSelector = state => state.viewEventPage.eventId;
const eventIdSelector = state => state.editEventPage.eventId;

// $FlowFixMe[missing-annot] automated comment
export const paramsSelector = createSelector(
    programIdSelector,
    trackedEntityTypeIdSelector,
    orgUnitIdSelector,
    eventIdSelector,
    viewEventIdSelector,
    (programId: ?string, trackedEntityTypeId: ?string, orgUnitId: ?string, eventId: ?string, viewEventId: ?string) => ({
        programId,
        trackedEntityTypeId,
        orgUnitId,
        eventId,
        viewEventId,
    }),
);
