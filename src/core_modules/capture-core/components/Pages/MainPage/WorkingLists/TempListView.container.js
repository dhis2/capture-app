// @flow
import { connect } from 'react-redux';
import withLoadingIndicator from '../../../../HOC/withLoadingIndicator';
import withErrorMessageHandler from '../../../../HOC/withErrorMessageHandler';
import { ListView } from '../../../ListView';
import { makeColumnsSelector, makeCreateEventsContainer, makeCreateWorkingListData } from './tempListView.selector';
import { sortWorkingList, openViewEventPage, requestDeleteEvent } from '../../../ListView/listView.actions';
import { updateWorkingListOrder } from '../../../ListView/ColumnSelector/actions/columnSelectorDialog.actions';

const makeMapStateToProps = () => {
    const columnsSelector = makeColumnsSelector();
    const createEventsContainer = makeCreateEventsContainer();
    const createWorkingListData = makeCreateWorkingListData();

    /* eslint-disable complexity */
    const mapStateToProps = (state: ReduxState, props: { listId: string }) => {
        const listId = props.listId;
        const { isLoading, dataLoadingError } = state.workingListsUI[listId];

        if (isLoading) {
            return {
                ready: !isLoading,
            };
        }

        if (dataLoadingError) {
            return {
                ready: !isLoading,
                error: dataLoadingError,
            };
        }

        const columns = columnsSelector(state, props);
        const eventsContainer = !isLoading ? createEventsContainer(state, props) : [];
        const sortById = !isLoading ? state.workingListsMeta[listId].sortById : null;
        const sortByDirection = !isLoading ? state.workingListsMeta[listId].sortByDirection : null;
        return {
            ready: !isLoading,
            error: dataLoadingError,
            isUpdating: !!state.workingListsUI[listId].isUpdating,
            isUpdatingWithDialog: !!state.workingListsUI[listId].isUpdatingWithDialog,
            columns,
            dataSource: createWorkingListData(eventsContainer, columns),
            sortById,
            sortByDirection,
            rowIdKey: 'eventId',
        };
    };

    return mapStateToProps;
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSort: (listId: string, id: string, direction: string) => {
        dispatch(sortWorkingList(listId, id, direction));
    },
    onRowClick: (rowData: {eventId: string}) => {
        window.scrollTo(0, 0);
        dispatch(openViewEventPage(rowData.eventId));
    },
    onView: (eventId: string) => {
        window.scrollTo(0, 0);
        dispatch(openViewEventPage(eventId));
    },
    onDelete: (eventId: string) => {
        dispatch(requestDeleteEvent(eventId));
    },
    onSaveColumnOrder: (listId: string, columnOrder: Array<Object>): void => {
        dispatch(updateWorkingListOrder(listId, columnOrder));
    },
});

export const TempListView = connect(makeMapStateToProps, mapDispatchToProps)(
    withLoadingIndicator(() => ({ padding: 10 }))(
        withErrorMessageHandler()(
            ListView,
        ),
    ),
);
