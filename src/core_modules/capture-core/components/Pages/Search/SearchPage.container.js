// @flow
import { connect } from 'react-redux';
import { compose } from 'redux';
import { SearchPage as SearchPageComponent } from './SearchPage.component';
import { withErrorMessageHandler, withLoadingIndicator } from '../../../HOC';
import type { DispatchersFromRedux, OwnProps, Props, PropsFromRedux } from './SearchPage.types';
import { addFormData } from '../../D2Form/actions/form.actions';
import { actionCreator } from '../../../actions/actions.utils';
import { searchPageActionTypes } from './SearchPage.actions';


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

const mapDispatchToProps = (dispatch: ReduxDispatch): DispatchersFromRedux => ({
    addFormIdToReduxStore: (formId) => { dispatch(addFormData(formId)); },
    showInitialSearchPage: () => { dispatch(actionCreator(searchPageActionTypes.SEARCH_RESULTS_INITIAL_VIEW)()); },
    navigateToMainPage: () => { dispatch(actionCreator(searchPageActionTypes.TO_MAIN_PAGE_NAVIGATE)()); },
    paginationChange: (newPage) => { dispatch(actionCreator(searchPageActionTypes.PAGINATION_CHANGE)({ newPage })); },
});

export const SearchPage =
  compose(
      connect<Props, OwnProps, _, _, _, _>(mapStateToProps, mapDispatchToProps),
      withLoadingIndicator(),
      withErrorMessageHandler(),
  )(SearchPageComponent);

