// @flow
import { typeKeys } from '../../../constants';
import { eventStatuses } from '../constants';
import type {
    EventData,
    EventsData,
    CompareDates,
    ProcessValue,
} from '../variableService.types';

const createEventsContainer = (events: EventsData) => {
    const eventsDataByStage = events.reduce((accEventsByStage, event) => {
        accEventsByStage[event.programStageId] = accEventsByStage[event.programStageId] || [];
        accEventsByStage[event.programStageId].push(event);
        return accEventsByStage;
    }, {});

    return { all: events, byStage: eventsDataByStage };
};

export const getStructureEvents = (compareDates: CompareDates, processValue: ProcessValue) => {
    const compareEvents = (first: EventData, second: EventData): number =>
        compareDates(
            processValue(first.occurredAt, typeKeys.DATE),
            processValue(second.occurredAt, typeKeys.DATE),
        ) ||
        compareDates(
            processValue(first.createdAt, typeKeys.DATETIME),
            processValue(second.createdAt, typeKeys.DATETIME),
        );

    return (currentEvent: EventData = {}, otherEvents: EventsData = []) => {
        const otherEventsFiltered = otherEvents
            .filter(event => event.occurredAt &&
                    [eventStatuses.COMPLETED, eventStatuses.ACTIVE, eventStatuses.VISITED].includes(event.status) &&
                    event.eventId !== currentEvent.eventId,
            );
        const events = Object.keys(currentEvent).length ?
            otherEventsFiltered.concat(currentEvent) : otherEventsFiltered;
        const sortedEvents = events.sort(compareEvents);

        return createEventsContainer(sortedEvents);
    };
};
