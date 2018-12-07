// @flow
import { connect } from 'react-redux';
import withErrorMessageHandler from '../../../../HOC/withErrorMessageHandler';
import withLoadingIndicator from '../../../../HOC/withLoadingIndicator';
import NewEnrollmentDataEntry from './NewEnrollmentDataEntry.component';

const mapStateToProps = (state: ReduxState) => ({
    ready: !state.newEnrollmentPage.dataEntryIsLoading,
    error: state.newEnrollmentPage.dataEntryError,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(
    withLoadingIndicator()(
        withErrorMessageHandler()(NewEnrollmentDataEntry),
    ),
);
