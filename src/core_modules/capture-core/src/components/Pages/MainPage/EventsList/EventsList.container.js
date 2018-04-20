// @flow
import { connect } from 'react-redux';
import EventsList from './EventsList.component';
import { makeElementsSelector, makeHeadersSelector, makeSortedHeadersSelector, makeCreateEventsContainer, makeCreateWorkingListData } from './eventsList.selector';

const makeMapStateToProps = () => {
    const elementsSelector = makeElementsSelector();
    const headersSelector = makeHeadersSelector();
    const sortedHeadersSelector = makeSortedHeadersSelector();
    const createEventsContainer = makeCreateEventsContainer();
    const createWorkingListData = makeCreateWorkingListData();

    const mapStateToProps = (state: ReduxState) => {
        const isLoading = !!state.workingListsUI.main.isLoading;
        const elements = elementsSelector(state);
        const headers = headersSelector(elements);
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
