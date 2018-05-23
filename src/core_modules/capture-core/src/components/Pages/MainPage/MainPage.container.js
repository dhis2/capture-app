// @flow
import { connect } from 'react-redux';
import MainPage from './MainPage.component';

const mapStateToProps = (state: ReduxState) => ({
    prerequisitesForWorkingListMet: !!state.mainPage.prerequisitesForWorkingListMet,
    newEventIsSaving: !!state.mainPage.newEventIsSaving,
    selectionsError: state.mainPage.selectionsError,
    isLoading: !!state.mainPage.isLoading,
});

// $FlowSuppress
export default connect(mapStateToProps)(MainPage);
