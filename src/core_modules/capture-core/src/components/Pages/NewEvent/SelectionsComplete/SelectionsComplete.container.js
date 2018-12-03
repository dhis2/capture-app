// @flow
import { connect } from 'react-redux';
import SelectionsComplete from './SelectionsComplete.component';
import getDataEntryHasChanges from '../getNewEventDataEntryHasChanges';


const mapStateToProps = (state: ReduxState) => ({
    showAddRelationship: !!state.newEventPage.showAddRelationship,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
});

// $FlowSuppress
export default connect(mapStateToProps, mapDispatchToProps)(SelectionsComplete);
