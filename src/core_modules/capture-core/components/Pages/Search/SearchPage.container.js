// @flow
import { connect } from 'react-redux';
import { compose } from 'redux';
import { SearchPage as SearchPageComponent } from './SearchPage.component';
import { withErrorMessageHandler, withLoadingIndicator } from '../../../HOC';
import type { OwnProps, Props, PropsFromRedux } from './SearchPage.types';

export const searchScopes = {
    PROGRAM: 'PROGRAM',
    TRACKED_ENTITY_TYPE: 'TRACKED_ENTITY_TYPE',
};

const mapStateToProps = (state: ReduxState): PropsFromRedux => {
    const { activePage } = state;

    return {
        error: activePage.selectionsError && activePage.selectionsError.error,
        ready: !activePage.isLoading,
    };
};

export const SearchPage =
  compose(
      connect<Props, OwnProps, _, _, _, _>(mapStateToProps, () => null),
      withLoadingIndicator(),
      withErrorMessageHandler(),
  )(SearchPageComponent);

