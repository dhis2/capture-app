// @flow
import { createSelectorCreator, createSelector, defaultMemoize } from 'reselect';

import getStageFromProgramIdForEventProgram from '../../../metaData/helpers/getStageFromProgramIdForEventProgram';
import getStageFromEvent from '../../../metaData/helpers/getStageFromEvent';
import { convertMainEvent } from '../../../events/mainEventConverter';
import { convertValue } from '../../../converters/clientToList';
import RenderFoundation from '../../../metaData/RenderFoundation/RenderFoundation';
import mainPropertyNames from '../../../events/mainPropertyNames.const';
import elementTypeKeys from '../../../metaData/DataElement/elementTypes';

type EventContainer = {
    event: CaptureClientEvent,
    eventValues: { [key: string]: any },
};

type ColumnOrderFromState = {
    id: string,
    visible: boolean,
    isMainProperty?: ?boolean,
};

type ColumnsOrderFromState = Array<ColumnOrderFromState>;

// #HEADERS
const programIdSelector = (state, props) => state.workingListsContext[props.listId].programId;
const columnsOrderStateSelector = (state, props) => state.workingListsColumnsOrder[props.listId];

export const makeColumnsSelector = () => createSelector(
    programIdSelector,
    columnsOrderStateSelector,
    (programId, columnsOrderFromState: ColumnsOrderFromState) => {
        const stageContainer = getStageFromProgramIdForEventProgram(programId);
        if (stageContainer.error) {
            return columnsOrderFromState;
        }

        // $FlowSuppress
        const stage: RenderFoundation = stageContainer.stage;

        return columnsOrderFromState
            .map((column) => {
                if (column.isMainProperty) {
                    if (column.id === mainPropertyNames.EVENT_DATE) {
                        return {
                            ...column,
                            header: stage.getLabel(mainPropertyNames.EVENT_DATE),
                            type: elementTypeKeys.DATE,
                        };
                    }
                    // fallback
                    return columnsOrderFromState;
                }
                const element = stage.getElement(column.id);
                return {
                    ...column,
                    header: element.formName,
                    type: element.type,
                };
            });
    },
);
// #END HEADERS

const eventsMainDataSelector = (state, props) => props.events;
const eventsValuesSelector = (state, props) => props.eventsValues;
const sortOrderSelector = (state, props) => state.workingLists[props.listId].order;


const createEventsContainer = (events, eventsValues, sortOrder): Array<EventContainer> =>
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
            const convertedMainEvent = convertMainEvent(eventContainer.event, convertValue);
            return {
                ...convertedMainEvent,
                ...convertedValues,
            };
        });
};


export const makeCreateWorkingListData = () => createDeepEqualSelector(
    eventsContainerSelector,
    buildWorkingListData,
);
