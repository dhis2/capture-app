// @flow
import { connect } from 'react-redux';
import { MainPageComponent } from './MainPage.component';
import { withErrorMessageHandler, withLoadingIndicator } from '../../../HOC';

const mapStateToProps = (state: ReduxState) => ({
    currentSelectionsComplete: !!state.currentSelections.complete,
    programId: state.currentSelections.programId,
    orgUnitId: state.currentSelections.orgUnitId,
    error: state.activePage.selectionsError && state.activePage.selectionsError.error, // TODO: Should probably remove this
    ready: !state.activePage.lockedSelectorLoads,  // TODO: Should probably remove this
});

// $FlowFixMe[missing-annot] automated comment
export const MainPage = connect(mapStateToProps)(withLoadingIndicator()(withErrorMessageHandler()(MainPageComponent)));
