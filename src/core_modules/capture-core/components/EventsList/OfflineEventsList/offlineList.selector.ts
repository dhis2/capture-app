import { createSelectorCreator, createSelector, defaultMemoize } from 'reselect';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import {
    getStageForEventProgram,
    OptionSet,
    Option,
    DataElement,
    dataElementTypes,
} from '../../../metaData';
import { getStageFromEvent } from '../../../metaData/helpers/getStageFromEvent';
import { convertValue } from '../../../converters/clientToList';
import type { RenderFoundation } from '../../../metaData';

type CaptureClientEvent = {
    eventId: string;
    programId: string;
    programStageId: string;
    orgUnitId: string;
    trackedEntityInstanceId?: string;
    enrollmentId?: string;
    enrollmentStatus?: string;
    status: 'ACTIVE' | 'COMPLETED' | 'VISITED' | 'SCHEDULE' | 'OVERDUE' | 'SKIPPED';
    occurredAt: string;
    scheduledAt: string;
    completedAt: string;
    attributeCategoryOptions?: string;
};

type EventContainer = {
    event: CaptureClientEvent;
    eventValues: { [key: string]: any };
};

type ColumnOrderFromState = {
    id: string;
    visible: boolean;
    isMainProperty?: boolean;
    header?: string;
    type?: keyof typeof dataElementTypes;
    options?: Array<{text: string; value: string}>;
};

type ColumnsOrderFromState = Array<ColumnOrderFromState>;

const programIdSelector = (state: any, props: any) => state.workingListsContext[props.listId].programId;
const columnsOrderStateSelector = (state: any, props: any) => state.workingListsColumnsOrder[props.listId];

const createMainPropertyOptionSet = (column: ColumnOrderFromState) => {
    const dataElement = new DataElement((o) => {
        o.id = column.id;
        o.type = column.type;
    });

    const options = column.options?.map(option =>
        new Option((o) => {
            o.text = option.text;
            o.value = option.value;
        }),
    );
    const optionSet = new OptionSet(column.id, options, null, dataElement);
    dataElement.optionSet = optionSet;
    return optionSet;
};

export const makeColumnsSelector = () => createSelector(
    programIdSelector,
    columnsOrderStateSelector,
    (programId: string, columnsOrderFromState: ColumnsOrderFromState) => {
        const stageContainer = getStageForEventProgram(programId);
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

const eventsMainDataSelector = (state: any, props: any) => props.events;
const eventsValuesSelector = (state: any, props: any) => props.eventsValues;
const sortOrderSelector = (state: any, props: any) => state.workingLists[props.listId].order;

const createEventsContainer = (events: any, eventsValues: any, sortOrder: any): Array<EventContainer> =>
    sortOrder
        .map((eventId: string) => ({
            event: events[eventId],
            eventValues: eventsValues[eventId],
        }));

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
    columns: any,
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
                .filter((column: any) => column.isMainProperty)
                .reduce((acc: any, mainColumn: any) => {
                    const sourceValue = eventContainer.event[mainColumn.id];
                    if (sourceValue) {
                        if (mainColumn.options) {
                            const option = mainColumn.options.find((o: any) => o.value === sourceValue);
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
                eventId: eventContainer.event.eventId,
            };
        });
};

export const makeCreateWorkingListData = () => createDeepEqualSelector(
    (eventContainers: any, columns: any) => ({ eventContainers, columns }),
    ({ eventContainers, columns }: any) =>
        buildWorkingListData(eventContainers, columns),
);
