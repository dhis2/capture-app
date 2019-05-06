// @flow
import { connect } from 'react-redux';
import MainPage from './MainPage.component';

const mapStateToProps = (state: ReduxState) => ({
    currentSelectionsComplete: !!state.currentSelections.complete,
});

// $FlowSuppress
export default connect(mapStateToProps)(MainPage);
