// @flow
import { connect } from 'react-redux';
import withErrorMessageHandler from '../../../../HOC/withErrorMessageHandler';
import withLoadingIndicator from '../../../../HOC/withLoadingIndicator';
import { DataEntry } from '../DataEntry';

const mapStateToProps = (state: ReduxState) => ({
    error: state.newEnrollmentPage.selectionsError,
    ready: !state.newEnrollmentPage.isLoading,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(
    withLoadingIndicator()(
        withErrorMessageHandler()(DataEntry),
    ),
);
