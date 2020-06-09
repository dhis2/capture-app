// @flow
import { connect } from 'react-redux';
import MainPage from './MainPage.component';
import { withErrorMessageHandler, withLoadingIndicator } from '../../../HOC';

const mapStateToProps = (state: ReduxState) => ({
    currentSelectionsComplete: !!state.currentSelections.complete,
    error: state.activePage.selectionsError && state.activePage.selectionsError.error,
    ready: !state.activePage.isLoading,
});

export default connect(mapStateToProps)(withLoadingIndicator()(withErrorMessageHandler()(MainPage)));
