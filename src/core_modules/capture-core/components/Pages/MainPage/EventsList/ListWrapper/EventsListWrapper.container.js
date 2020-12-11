// @flow
import { connect } from 'react-redux';
import EventsListWrapper from './EventsListWrapper.component';
import { makeColumnsSelector, makeCreateEventsContainer, makeCreateWorkingListData } from './eventsList.selector';
import { sortWorkingList, openViewEventPage, requestDeleteEvent } from '../eventsList.actions';
import { updateWorkinglistOrder } from './actions/columnSelectorDialog.actions';

const makeMapStateToProps = () => {
    const columnsSelector = makeColumnsSelector();
    const createEventsContainer = makeCreateEventsContainer();
    const createWorkingListData = makeCreateWorkingListData();

    const mapStateToProps = (state: ReduxState, props: { listId: string }) => {
        const {listId} = props;
        const isLoading = !!state.workingListsUI[listId].isLoading;
        const columns = !isLoading ? columnsSelector(state, props) : null;
        const eventsContainer = !isLoading ? createEventsContainer(state, props) : [];
        const sortById = !isLoading ? state.workingListsMeta[listId].sortById : null;
        const sortByDirection = !isLoading ? state.workingListsMeta[listId].sortByDirection : null;
        return {
            isUpdating: !!state.workingListsUI[listId].isUpdating,
            isUpdatingWithDialog: !!state.workingListsUI[listId].isUpdatingWithDialog,
            columns,
            dataSource: createWorkingListData(eventsContainer, columns),
            sortById,
            sortByDirection,
            rowIdKey: 'eventId',
        };
    };
    // $FlowFixMe[not-an-object] automated comment
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
        dispatch(updateWorkinglistOrder(listId, columnOrder));
    },
});

// $FlowFixMe[missing-annot] automated comment
export default connect(makeMapStateToProps, mapDispatchToProps)(EventsListWrapper);
