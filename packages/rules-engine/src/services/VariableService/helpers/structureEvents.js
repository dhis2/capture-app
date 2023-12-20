// @flow
import { eventStatuses } from '../constants';
import type {
    EventData,
    EventsData,
    CompareDates,
} from '../variableService.types';

const createEventsContainer = (events: EventsData) => {
    const eventsDataByStage = events.reduce((accEventsByStage, event) => {
        accEventsByStage[event.programStageId] = accEventsByStage[event.programStageId] || [];
        accEventsByStage[event.programStageId].push(event);
        return accEventsByStage;
    }, {});

    return { all: events, byStage: eventsDataByStage };
};

export const getStructureEvents = (compareDates: CompareDates) => {
    const compareEvents = (first: EventData, second: EventData): number => {
        let result;
        if (!first.occurredAt && !second.occurredAt) {
            result = 0;
        } else if (!first.occurredAt) {
            result = 1;
        } else if (!second.occurredAt) {
            result = -1;
        } else {
            result = compareDates(first.occurredAt, second.occurredAt);
        }
        return result;
    };

    return (currentEvent: EventData = {}, otherEvents: EventsData = []) => {
        const otherEventsFiltered = otherEvents
            .filter(event => event.occurredAt &&
                    [eventStatuses.COMPLETED, eventStatuses.ACTIVE, eventStatuses.VISITED].includes(event.status) &&
                    event.eventId !== currentEvent.eventId,
            );

        const events = Object.keys(currentEvent).length !== 0 ? otherEventsFiltered.concat(currentEvent) : otherEventsFiltered;
        const sortedEvents = events.sort(compareEvents);

        return createEventsContainer(sortedEvents);
    };
};
