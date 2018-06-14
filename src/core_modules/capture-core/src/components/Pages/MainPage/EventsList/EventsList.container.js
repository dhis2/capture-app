// @flow
import { connect } from 'react-redux';
import EventsList from './EventsList.component';
import { makeColumnsSelector, makeCreateEventsContainer, makeCreateWorkingListData } from './eventsList.selector';
import { sortWorkingList, openEditEventPage } from './eventsList.actions';
import withStateBoundLoadingIndicator from '../../../../HOC/withStateBoundLoadingIndicator';

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
        dispatch(openEditEventPage(rowData.eventId));
    },
});

export default withStateBoundLoadingIndicator(
    state => !state.workingListsUI.main.isLoading)(
    connect(makeMapStateToProps, mapDispatchToProps)(EventsList));
