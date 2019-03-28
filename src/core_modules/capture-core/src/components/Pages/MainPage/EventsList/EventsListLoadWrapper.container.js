// @flow
import { connect } from 'react-redux';
import EventsListWrapper from './ListWrapper/EventsListWrapper.container';
import withLoadingIndicator from '../../../../HOC/withLoadingIndicator';
import withErrorMessageHandler from '../../../../HOC/withErrorMessageHandler';

const mapStateToProps = (state: ReduxState, props: { listId: string }) => ({
    ready: state.workingListsUI[props.listId] && !state.workingListsUI[props.listId].isLoading,
    error: state.workingListsUI[props.listId] && state.workingListsUI[props.listId].dataLoadingError,
});

export default connect(mapStateToProps, {})(
    withLoadingIndicator()(
        withErrorMessageHandler()(
            EventsListWrapper,
        ),
    ),
);
