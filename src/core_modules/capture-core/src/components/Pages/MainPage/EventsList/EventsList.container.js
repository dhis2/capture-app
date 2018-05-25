// @flow
import { connect } from 'react-redux';
import EventsList from './EventsList.component';
import { makeColumnsSelector, makeCreateEventsContainer, makeCreateWorkingListData } from './eventsList.selector';
import { sortWorkingList } from './eventsList.actions';
import withLoadingIndicator from '../../../../HOC/withLoadingIndicator';

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
            ready: isLoading,
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
});

export default connect(makeMapStateToProps, mapDispatchToProps)(withLoadingIndicator()(EventsList));
