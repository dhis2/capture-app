// @flow
import log from 'loglevel';
import { errorCreator, pipe } from 'capture-core-utils';
import { getEventWorkingListDataAsync } from './eventsRetriever';
import {
    updateEventListSuccess,
    updateEventListError,
} from '../eventWorkingLists.actions';
import { buildQueryArgs } from '../helpers/eventsQueryArgsBuilder';


const errorMessages = {
    WORKING_LIST_UPDATE_ERROR: 'Working list could not be updated',
};

const getSourceQueryArgsForUpdateWorkingList = (
    state: ReduxState,
    listId: string,
    sourceQueryArgsPart: Object,
) => {
    const { programId, orgUnitId, categories } = state.workingListsContext[listId];

    return {
        programId,
        orgUnitId,
        categories,
        ...sourceQueryArgsPart,
    };
};

export const updateEventWorkingListAsync = (
    listId: string,
    sourceQueryArgsPart: Object,
    state: ReduxState,
): Promise<ReduxAction<any, any>> => {
    const sourceQueryData = getSourceQueryArgsForUpdateWorkingList(state, listId, sourceQueryArgsPart);
    const columnOrder = state.workingListsColumnsOrder[listId];
    const mainColumnTypes = pipe(
        columns => columns.filter(column => column.isMainProperty),
        columOrderMainOnly => columOrderMainOnly.reduce((acc, column) => ({
            ...acc,
            [column.id]: column.type,
        }), {}),
    )(columnOrder);

    return getEventWorkingListDataAsync(
        buildQueryArgs(
            sourceQueryData,
            {
                listId,
                mainPropTypes: mainColumnTypes,
                isInit: false,
            }),
        columnOrder)
        .then(data =>
            updateEventListSuccess(listId, data),
        )
        .catch((error) => {
            log.error(errorCreator(errorMessages.WORKING_LIST_UPDATE_ERROR)({ error }));
            return updateEventListError(listId, errorMessages.WORKING_LIST_UPDATE_ERROR);
        });
};
