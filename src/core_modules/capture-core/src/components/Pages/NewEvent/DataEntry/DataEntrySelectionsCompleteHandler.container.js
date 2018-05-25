// @flow
import { connect } from 'react-redux';
import DataEntrySelectionsCompleteHandler from './DataEntrySelectionsCompleteHandler.component';

const mapStateToProps = (state: ReduxState) => ({
    isSelectionsComplete: !!state.currentSelections.complete,
});

// $FlowSuppress
export default connect(mapStateToProps)(DataEntrySelectionsCompleteHandler);
