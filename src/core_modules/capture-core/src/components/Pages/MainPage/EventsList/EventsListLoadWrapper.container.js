// @flow
import { connect } from 'react-redux';
import EventsListWrapper from './ListWrapper/EventsListWrapper.container';
import withLoadingIndicator from '../../../../HOC/withLoadingIndicator';
import withErrorMessageHandler from '../../../../HOC/withErrorMessageHandler';

const mapStateToProps = (state: ReduxState) => ({
    ready: state.workingListsUI.main && !state.workingListsUI.main.isLoading,
    error: state.workingListsUI.main && state.workingListsUI.main.dataLoadingError,
});

export default connect(mapStateToProps, {})(
    withLoadingIndicator()(
        withErrorMessageHandler()(
            EventsListWrapper,
        ),
    ),
);
