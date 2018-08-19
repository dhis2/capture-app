// @flow
import { connect } from 'react-redux';
import NewEvent from './NewEvent.component';

const mapStateToProps = (state: ReduxState) => ({
    isLoading: state.newEventPage.isLoading,
    isSelectionsComplete: !!state.currentSelections.complete,
    selectionsError: state.newEventPage.selectionsError,
});

// $FlowSuppress
export default connect(mapStateToProps)(NewEvent);
