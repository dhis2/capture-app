// @flow
import { connect } from 'react-redux';
import OfflineEventsList from './OfflineEventsList.component';
import {
    makeColumnsSelector,
    makeCreateEventsContainer,
    makeCreateWorkingListData,
} from './offlineEventsList.selector';
import { openEditEventPage } from '../EventsList/eventsList.actions'; // temporary?

const makeMapStateToProps = () => {
    const columnsSelector = makeColumnsSelector();
    const createEventsContainer = makeCreateEventsContainer();
    const createWorkingListData = makeCreateWorkingListData();

    const mapStateToProps = (state: ReduxState) => {
        const columns = columnsSelector(state);
        const eventsContainer = createEventsContainer(state);
        const sortById = state.workingListsMeta.main.sortById;
        const sortByDirection = state.workingListsMeta.main.sortByDirection;
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
    onRowClick: (rowData: {eventId: string}) => {
        window.scrollTo(0, 0);
        dispatch(openEditEventPage(rowData.eventId));
    },
});

export default connect(makeMapStateToProps, mapDispatchToProps)(OfflineEventsList);
