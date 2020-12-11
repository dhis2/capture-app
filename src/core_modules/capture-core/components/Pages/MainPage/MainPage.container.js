// @flow
import { connect } from 'react-redux';
import { MainPageComponent } from './MainPage.component';
import { withErrorMessageHandler, withLoadingIndicator } from '../../../HOC';

const mapStateToProps = (state: ReduxState) => ({
  currentSelectionsComplete: !!state.currentSelections.complete,
  error: state.activePage.selectionsError && state.activePage.selectionsError.error,
  ready: !state.activePage.isPageLoading,
});

// $FlowFixMe[missing-annot] automated comment
export const MainPage = connect(mapStateToProps)(
  withLoadingIndicator()(withErrorMessageHandler()(MainPageComponent)),
);
