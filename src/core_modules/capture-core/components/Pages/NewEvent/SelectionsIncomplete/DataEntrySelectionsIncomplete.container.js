// @flow
import type { ComponentType } from 'react';
import { connect } from 'react-redux';
import { DataEntrySelectionsIncompleteComponent } from './DataEntrySelectionsIncomplete.component';
import { cancelNewEventFromIncompleteSelectionAndReturnToMainPage } from './dataEntrySelectionsIncomplete.actions';
import type {
  DispatchersFromRedux,
  Props,
  PropsFromRedux,
} from './DataEntrySelectionsIncomplete.types';

const mapStateToProps = (state: ReduxState): PropsFromRedux => ({
  isProgramSelected: !!state.currentSelections.programId,
  isOrgUnitSelected: !!state.currentSelections.orgUnitId,
});

const mapDispatchToProps = (dispatch: ReduxDispatch): DispatchersFromRedux => ({
  onCancel: () => {
    dispatch(cancelNewEventFromIncompleteSelectionAndReturnToMainPage());
  },
});

export const DataEntrySelectionsIncomplete: ComponentType<{||}> = connect<
  $Diff<Props, CssClasses>,
  _,
  _,
  _,
  _,
  _,
>(
  mapStateToProps,
  mapDispatchToProps,
)(DataEntrySelectionsIncompleteComponent);
