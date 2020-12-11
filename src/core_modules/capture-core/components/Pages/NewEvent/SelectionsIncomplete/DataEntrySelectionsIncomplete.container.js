// @flow
import { connect } from 'react-redux';
import DataEntrySelectionsIncomplete from './DataEntrySelectionsIncomplete.component';
import { cancelNewEventFromIncompleteSelectionAndReturnToMainPage } from './dataEntrySelectionsIncomplete.actions';

const mapStateToProps = (state: ReduxState) => ({
  isProgramSelected: !!state.currentSelections.programId,
  isOrgUnitSelected: !!state.currentSelections.orgUnitId,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
  onCancel: () => {
    dispatch(cancelNewEventFromIncompleteSelectionAndReturnToMainPage());
  },
});

// $FlowSuppress
// $FlowFixMe[missing-annot] automated comment
export default connect(mapStateToProps, mapDispatchToProps)(DataEntrySelectionsIncomplete);
