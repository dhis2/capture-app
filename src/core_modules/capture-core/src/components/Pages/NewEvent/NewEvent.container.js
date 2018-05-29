// @flow
import { connect } from 'react-redux';
import NewEvent from './NewEvent.component';

const mapStateToProps = (state: ReduxState) => ({
    isLoading: state.newEventPage.isLoading,
    selectionsError: state.newEventPage.selectionsError,
});

// $FlowSuppress
export default connect(mapStateToProps)(NewEvent);
