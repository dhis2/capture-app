// @flow
import { connect } from 'react-redux';
import OfflineEventsList from './OfflineEventsList.component';
import {
    makeColumnsSelector,
    makeCreateEventsContainer,
    makeCreateWorkingListData,
} from './offlineEventsList.selector';

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

export default connect(makeMapStateToProps)(OfflineEventsList);
