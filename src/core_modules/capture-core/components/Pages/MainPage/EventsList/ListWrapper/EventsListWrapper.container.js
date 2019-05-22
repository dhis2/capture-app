// @flow
import { connect } from 'react-redux';
import EventsListWrapper from './EventsListWrapper.component';
import { makeColumnsSelector, makeCreateEventsContainer, makeCreateWorkingListData } from './eventsList.selector';
import { sortWorkingList, openViewEventPage, requestDeleteEvent } from '../eventsList.actions';

const makeMapStateToProps = () => {
    const columnsSelector = makeColumnsSelector();
    const createEventsContainer = makeCreateEventsContainer();
    const createWorkingListData = makeCreateWorkingListData();

    const mapStateToProps = (state: ReduxState) => {
        const isLoading = !!state.workingListsUI.main.isLoading;
        const columns = !isLoading ? columnsSelector(state) : null;
        const eventsContainer = !isLoading ? createEventsContainer(state) : [];
        const sortById = !isLoading ? state.workingListsMeta.main.sortById : null;
        const sortByDirection = !isLoading ? state.workingListsMeta.main.sortByDirection : null;
        return {
            isUpdating: !!state.workingListsUI.main.isUpdating,
            isUpdatingWithDialog: !!state.workingListsUI.main.isUpdatingWithDialog,
            columns,
            dataSource: createWorkingListData(eventsContainer),
            sortById,
            sortByDirection,
        };
    };
    return mapStateToProps;
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onSort: (id: string, direction: string) => {
        dispatch(sortWorkingList(id, direction));
    },
    onRowClick: (rowData: {eventId: string}) => {
        window.scrollTo(0, 0);
        dispatch(openViewEventPage(rowData.eventId));
    },
    onView: (rowData: {eventId: string}) => {
        window.scrollTo(0, 0);
        dispatch(openViewEventPage(rowData.eventId));
    },
    onDelete: (eventId: string) => {
        dispatch(requestDeleteEvent(eventId));
    },
});

export default connect(makeMapStateToProps, mapDispatchToProps)(EventsListWrapper);
