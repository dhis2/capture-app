// @flow
import { connect } from 'react-redux';
import EventsListWrapper from './ListWrapper/EventsListWrapper.container';
import withLoadingIndicator from '../../HOC/withLoadingIndicator';
import withErrorMessageHandler from '../../HOC/withErrorMessageHandler';

const mapStateToProps = (state: ReduxState, props: {listId: ?string}) => {
    const listId = props.listId;
    return {
        ready: listId && state.workingListsUI[listId] && !state.workingListsUI[listId].isLoading,
        error: listId && state.workingListsUI[listId] && state.workingListsUI[listId].dataLoadingError,
    };
};

// $FlowFixMe[missing-annot] automated comment
export default connect(mapStateToProps, {})(
    withLoadingIndicator(() => ({ padding: 10 }))(
        withErrorMessageHandler()(
            EventsListWrapper,
        ),
    ),
);
