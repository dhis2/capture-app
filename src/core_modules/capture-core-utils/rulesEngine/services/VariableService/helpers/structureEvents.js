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
        if (!first.eventDate && !second.eventDate) {
            result = 0;
        } else if (!first.eventDate) {
            result = 1;
        } else if (!second.eventDate) {
            result = -1;
        } else {
            result = compareDates(first.eventDate, second.eventDate);
        }
        return result;
    };

    return (currentEvent: EventData = {}, otherEvents: EventsData = []) => {
        const otherEventsFiltered = otherEvents
            .filter(event => event.eventDate &&
                    [eventStatuses.COMPLETED, eventStatuses.ACTIVE, eventStatuses.VISITED].includes(event.status));

        const events = [...otherEventsFiltered, currentEvent]
            .sort(compareEvents);

        return createEventsContainer(events);
    };
};
