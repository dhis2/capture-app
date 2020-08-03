// @flow
import { connect } from 'react-redux';
import { compose } from 'redux';
import withStyles from '@material-ui/core/styles/withStyles';
import { getStyles, SearchPageComponent } from './SearchPage.component';
import { withErrorMessageHandler, withLoadingIndicator } from '../../../HOC';
import type { OwnProps, Props, PropsFromRedux } from './SearchPage.types';

const mapStateToProps = (state: ReduxState): PropsFromRedux => {
    const { activePage } = state;

    return {
        error: activePage.selectionsError && activePage.selectionsError.error,
        ready: !activePage.isLoading,
    };
};

export const SearchPage =
  compose(
      connect<Props, OwnProps, _, _, _, _>(mapStateToProps, () => {}),
      withLoadingIndicator(),
      withErrorMessageHandler(),
      withStyles(getStyles),
  )(SearchPageComponent);

