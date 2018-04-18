// @flow
import { createSelectorCreator, createSelector, defaultMemoize } from 'reselect';
import { ensureState } from 'redux-optimistic-ui';

import programCollection from '../../../../metaDataMemoryStores/programCollection/programCollection';
import getStageFromEvent from '../../../../metaData/helpers/getStageFromEvent';
import { convertValue } from '../../../../converters/clientToList';
import RenderFoundation from '../../../../metaData/RenderFoundation/RenderFoundation';

type EventContainer = {
    event: Event,
    eventValues: { [key: string]: any },
};

// #HEADERS
const programIdSelector = state => state.currentSelections.programId;

export const makeHeadersSelector = () => createSelector(
    programIdSelector,
    (programId) => {
        const program = programCollection.get(programId);
        if (!program) {
            return [];
        }

        const foundation: RenderFoundation = program.getStage();
        if (!foundation) {
            return [];
        }

        const elements = foundation.getElements();

        return elements
            .map(element => ({
                id: element.id,
                text: element.formName,
            }));
    },
);

const headersSelector = headers => headers;

export const makeSortedHeadersSelector = () => createSelector(
    headersSelector,
    headers => headers,
);
// #END HEADERS

const eventsMainDataSelector = state => ensureState(state.events);
const eventsValuesSelector = state => ensureState(state.eventsValues);
const sortOrderSelector = state => state.workingLists.main.order;


const createEventsContainer = (events, eventsValues, sortOrder): EventContainer =>
    sortOrder
        .map(eventId => ({
            event: events[eventId],
            eventValues: eventsValues[eventId],
        }));

export const makeCreateEventsContainer = () => createSelector(
    eventsMainDataSelector,
    eventsValuesSelector,
    sortOrderSelector,
    createEventsContainer,
);

const onIsEventsEqual = (prevEventsContainer: Array<EventContainer>, currentEventsContainer: Array<EventContainer>) =>
    currentEventsContainer.every(
        (eventContainer, index) =>
            eventContainer.event === (prevEventsContainer[index] && prevEventsContainer[index].event) &&
            eventContainer.eventValues === (prevEventsContainer[index] && prevEventsContainer[index].eventValues),
    ) &&
    prevEventsContainer.every(
        (eventContainer, index) =>
            eventContainer.event === (currentEventsContainer[index] && currentEventsContainer[index].event) &&
            eventContainer.eventValues === (currentEventsContainer[index] && currentEventsContainer[index].eventValues),
    );

const createDeepEqualSelector = createSelectorCreator(
    defaultMemoize,
    onIsEventsEqual,
);

const eventsContainerSelector = eventContainers => eventContainers;

const buildWorkingListData = (eventsContainer: Array<EventContainer>) => {
    if (eventsContainer.length === 0) {
        return [];
    }

    const { stage, error } = getStageFromEvent(eventsContainer[0].event);
    if (error || !stage) {
        return null;
    }

    return eventsContainer
        .map((eventContainer) => {
            const convertedValues = stage.convertValues(eventContainer.eventValues, convertValue);
            return convertedValues;
        })
        .filter(data => data);
};


export const makeCreateWorkingListData = () => createDeepEqualSelector(
    eventsContainerSelector,
    eventsContainer =>
        buildWorkingListData(eventsContainer),
);
