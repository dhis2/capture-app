// @flow
import { connect } from 'react-redux';
import MainPage from './MainPage.component';

const mapStateToProps = (state: ReduxState) => ({
    prerequisitesForWorkingListMet: !!state.mainPage.prerequisitesForWorkingListMet,
});

// $FlowSuppress
export default connect(mapStateToProps)(MainPage);
