// @flow
import { connect } from 'react-redux';
import EventsList from './EventsList.component';
import { makeHeadersSelector, makeSortedHeadersSelector, makeCreateEventsContainer, makeCreateWorkingListData } from './eventsList.selector';

const makeMapStateToProps = () => {
    const headersSelector = makeHeadersSelector();
    const sortedHeadersSelector = makeSortedHeadersSelector();
    const createEventsContainer = makeCreateEventsContainer();
    const createWorkingListData = makeCreateWorkingListData();

    const mapStateToProps = (state: ReduxState) => {
        const isLoading = !!state.workingLists.main.isLoading;
        const headers = headersSelector(state);
        const eventsContainer = !isLoading ? createEventsContainer(state) : [];
        return {
            headers: sortedHeadersSelector(headers),
            dataSource: createWorkingListData(eventsContainer),
            isLoading,
        };
    };
    return mapStateToProps;
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    
});

export default connect(makeMapStateToProps, mapDispatchToProps)(EventsList);
