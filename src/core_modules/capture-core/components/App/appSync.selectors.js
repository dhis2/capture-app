// @flow
import { createSelector } from 'reselect';

const programIdSelector = state => state.currentSelections.programId;
const trackedEntityTypeIdSelector = state => state.currentSelections.trackedEntityTypeId;
const trackedEntityInstanceIdSelector = state => state.currentSelections.trackedEntityInstanceId;
const enrollmentIdSelector = state => state.currentSelections.enrollmentId;
const orgUnitIdSelector = state => state.currentSelections.orgUnitId;
const viewEventIdSelector = state => state.viewEventPage.eventId;
const eventIdSelector = state => state.editEventPage.eventId;

// $FlowFixMe[missing-annot] automated comment
export const paramsSelector = createSelector(
    programIdSelector,
    trackedEntityTypeIdSelector,
    trackedEntityInstanceIdSelector,
    enrollmentIdSelector,
    orgUnitIdSelector,
    eventIdSelector,
    viewEventIdSelector,
    (
        programId: ?string,
        trackedEntityTypeId: ?string,
        trackedEntityInstanceId: ?string,
        enrollmentId: ?string,
        orgUnitId: ?string,
        eventId: ?string,
        viewEventId: ?string,
    ) => ({
        programId,
        trackedEntityTypeId,
        enrollmentId,
        orgUnitId,
        eventId,
        viewEventId,
    }),
);
