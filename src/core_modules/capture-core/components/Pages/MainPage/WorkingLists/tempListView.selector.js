// @flow
import { createSelectorCreator, createSelector, defaultMemoize } from 'reselect';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import {
    getStageFromProgramIdForEventProgram,
    OptionSet,
    Option,
    DataElement,
    dataElementTypes,
} from '../../../../metaData';
import getStageFromEvent from '../../../../metaData/helpers/getStageFromEvent';
import { convertValue } from '../../../../converters/clientToList';
import RenderFoundation from '../../../../metaData/RenderFoundation/RenderFoundation';

type EventContainer = {
    event: CaptureClientEvent,
    eventValues: { [key: string]: any },
};

type ColumnOrderFromState = {
    id: string,
    visible: boolean,
    isMainProperty?: ?boolean,
    header?: ?string,
    type?: ?$Values<typeof dataElementTypes>,
    options?: ?Array<{text: string, value: string}>,
};

type ColumnsOrderFromState = Array<ColumnOrderFromState>;

// #HEADERS
const programIdSelector = (state, props) => state.workingListsContext[props.listId].programId;
const columnsOrderStateSelector = (state, props) => state.workingListsColumnsOrder[props.listId];

const createMainPropertyOptionSet = (column: ColumnOrderFromState) => {
    const dataElement = new DataElement((o) => {
        o.id = column.id;
        // $FlowFixMe
        o.type = column.type;
    });

    // $FlowFixMe
    const options = column.options.map(option =>
        new Option((o) => {
            o.text = option.text;
            o.value = option.value;
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
const sortOrderSelector = (state, props) => state.workingLists[props.listId].order;


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

const onIsEventsEqual = (
    { eventContainers: prevEventContainers }: { eventContainers: Array<EventContainer> },
    { eventContainers: currentEventContainers }: { eventContainers: Array<EventContainer> },
) =>
    currentEventContainers.every(
        (eventContainer, index) =>
            eventContainer.event === (prevEventContainers[index] && prevEventContainers[index].event) &&
            eventContainer.eventValues === (prevEventContainers[index] && prevEventContainers[index].eventValues),
    ) &&
    prevEventContainers.every(
        (eventContainer, index) =>
            eventContainer.event === (currentEventContainers[index] && currentEventContainers[index].event) &&
            eventContainer.eventValues === (currentEventContainers[index] && currentEventContainers[index].eventValues),
    );

const createDeepEqualSelector = createSelectorCreator(
    defaultMemoize,
    onIsEventsEqual,
);

const buildWorkingListData = (
    eventsContainer: Array<EventContainer>,
    columns,
) => {
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

            const convertedMainEvent = columns
                .filter(column => column.isMainProperty)
                .reduce((acc, mainColumn) => {
                    const sourceValue = eventContainer.event[mainColumn.id];
                    if (sourceValue) {
                        if (mainColumn.options) {
                            // TODO: Need is equal comparer for types
                            const option = mainColumn.options.find(o => o.value === sourceValue);
                            if (!option) {
                                log.error(
                                    errorCreator(
                                        'Missing value in options for main values')(
                                        { sourceValue, mainColumn }),
                                );
                            } else {
                                acc[mainColumn.id] = option.text;
                            }
                        } else {
                            acc[mainColumn.id] = convertValue(sourceValue, mainColumn.type);
                        }
                    }
                    return acc;
                }, {});
            return {
                ...convertedMainEvent,
                ...convertedValues,
                eventId: eventContainer.event.eventId, // used as rowkey
            };
        });
};

// $FlowFixMe
export const makeCreateWorkingListData = () => createDeepEqualSelector(
    (eventContainers, columns) => ({ eventContainers, columns }),
    ({ eventContainers, columns }) =>
        buildWorkingListData(eventContainers, columns),
);
