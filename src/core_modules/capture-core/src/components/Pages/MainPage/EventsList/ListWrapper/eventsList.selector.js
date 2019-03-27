// @flow
import { createSelectorCreator, createSelector, defaultMemoize } from 'reselect';

import { getStageFromProgramIdForEventProgram, OptionSet, Option, DataElement } from '../../../../../metaData';
import getStageFromEvent from '../../../../../metaData/helpers/getStageFromEvent';
import { convertMainEvent } from '../../../../../events/mainEventConverter';
import { convertValue } from '../../../../../converters/clientToList';
import RenderFoundation from '../../../../../metaData/RenderFoundation/RenderFoundation';
import elementTypes from '../../../../../metaData/DataElement/elementTypes';

type EventContainer = {
    event: CaptureClientEvent,
    eventValues: { [key: string]: any },
};

type ColumnOrderFromState = {
    id: string,
    visible: boolean,
    isMainProperty?: ?boolean,
    header?: ?string,
    type?: ?$Values<typeof elementTypes>,
    options?: ?Array<{text: string, value: string}>,
};

type ColumnsOrderFromState = Array<ColumnOrderFromState>;

// #HEADERS
const programIdSelector = state => state.currentSelections.programId;
const columnsOrderStateSelector = state => state.workingListsColumnsOrder.main;


const createMainPropertyOptionSet = (column: ColumnOrderFromState) => {
    const dataElement = new DataElement((_this) => {
        _this.id = column.id;
        // $FlowFixMe
        _this.type = column.type;
    });

    // $FlowFixMe
    const options = column.options.map(o =>
        new Option((_this) => {
            _this.text = o.text;
            _this.value = o.value;
        }),
    );
    const optionSet = new OptionSet(column.id, options, null, dataElement);
    dataElement.optionSet = optionSet;
    return optionSet;
};
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
                    return {
                        ...column,
                        header: column.header || stageForm.getLabel(column.id),
                        optionSet: column.options && createMainPropertyOptionSet(column),
                    };
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
