// @flow
import { createSelectorCreator, createSelector, defaultMemoize } from 'reselect';

import { getStageFromProgramIdForEventProgram } from '../../../../../metaData';
import getStageFromEvent from '../../../../../metaData/helpers/getStageFromEvent';
import { convertMainEvent } from '../../../../../events/mainEventConverter';
import { convertValue } from '../../../../../converters/clientToList';
import RenderFoundation from '../../../../../metaData/RenderFoundation/RenderFoundation';
import mainPropertyNames from '../../../../../events/mainPropertyNames.const';
import elementTypeKeys from '../../../../../metaData/DataElement/elementTypes';

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
const programIdSelector = state => state.currentSelections.programId;
const columnsOrderStateSelector = state => state.workingListsColumnsOrder.main;

// $FlowFixMe
export const makeColumnsSelector = () => createSelector(
    programIdSelector,
    columnsOrderStateSelector,
    (programId, columnsOrderFromState: ColumnsOrderFromState) => {
        const stageContainer = getStageFromProgramIdForEventProgram(programId);
        if (stageContainer.error) {
            return columnsOrderFromState;
        }

        // $FlowSuppress
        const stageForm: RenderFoundation = stageContainer.stage.stageForm;

        return columnsOrderFromState
            .map((column) => {
                if (column.isMainProperty) {
                    if (column.id === mainPropertyNames.EVENT_DATE) {
                        return {
                            ...column,
                            header: stageForm.getLabel(mainPropertyNames.EVENT_DATE),
                            type: elementTypeKeys.DATE,
                        };
                    }
                    // fallback
                    return columnsOrderFromState;
                }
                const element = stageForm.getElement(column.id);
                return {
                    ...column,
                    header: element.formName,
                    type: element.type,
                    optionSet: element.optionSet,
                };
            });
    },
);
// #END HEADERS

const eventsMainDataSelector = state => state.events;
const eventsValuesSelector = state => state.eventsValues;
const sortOrderSelector = state => state.workingLists.main.order;


const createEventsContainer = (events, eventsValues, sortOrder): Array<EventContainer> =>
    sortOrder
        .map(eventId => ({
            event: events[eventId],
            eventValues: eventsValues[eventId],
        }));

// $FlowFixMe
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
            const convertedValues = stage.stageForm.convertValues(eventContainer.eventValues, convertValue);
            const convertedMainEvent = convertMainEvent(eventContainer.event, convertValue);
            return {
                ...convertedMainEvent,
                ...convertedValues,
            };
        });
};

// $FlowFixMe
export const makeCreateWorkingListData = () => createDeepEqualSelector(
    eventsContainerSelector,
    eventsContainer =>
        buildWorkingListData(eventsContainer),
);
