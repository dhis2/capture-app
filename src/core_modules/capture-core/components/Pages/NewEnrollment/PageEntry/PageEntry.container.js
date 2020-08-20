// @flow
import { connect } from 'react-redux';
import withErrorMessageHandler from '../../../../HOC/withErrorMessageHandler';
import withLoadingIndicator from '../../../../HOC/withLoadingIndicator';
import DataEntryWrapper from '../DataEntryWrapper/DataEntryWrapper.container';

const mapStateToProps = (state: ReduxState) => ({
    error: state.newEnrollmentPage.selectionsError,
    ready: !state.newEnrollmentPage.isLoading,
});

const mapDispatchToProps = () => ({

});
// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(
    withLoadingIndicator(() => ({ margin: 4 }))(
        withErrorMessageHandler()(DataEntryWrapper),
    ),
);
