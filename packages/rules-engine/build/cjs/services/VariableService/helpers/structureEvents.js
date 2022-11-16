"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStructureEvents = void 0;

var _constants = require("../constants");

const createEventsContainer = events => {
  const eventsDataByStage = events.reduce((accEventsByStage, event) => {
    accEventsByStage[event.programStageId] = accEventsByStage[event.programStageId] || [];
    accEventsByStage[event.programStageId].push(event);
    return accEventsByStage;
  }, {});
  return {
    all: events,
    byStage: eventsDataByStage
  };
};

const getStructureEvents = compareDates => {
  const compareEvents = (first, second) => {
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

  return function () {
    let currentEvent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let otherEvents = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    const otherEventsFiltered = otherEvents.filter(event => event.occurredAt && [_constants.eventStatuses.COMPLETED, _constants.eventStatuses.ACTIVE, _constants.eventStatuses.VISITED].includes(event.status) && event.eventId !== currentEvent.eventId);
    const events = [...otherEventsFiltered, currentEvent].sort(compareEvents);
    return createEventsContainer(events);
  };
};

exports.getStructureEvents = getStructureEvents;