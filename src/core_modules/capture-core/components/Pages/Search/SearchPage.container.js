// @flow
import { connect } from 'react-redux';
import { compose } from 'redux';
import { SearchPage as SearchPageComponent } from './SearchPage.component';
import { programCollection } from '../../../metaDataMemoryStores';
import { TrackerProgram } from '../../../metaData/Program';
import { withErrorMessageHandler, withLoadingIndicator } from '../../../HOC';
import type { DispatchersFromRedux, OwnProps, Props, PropsFromRedux } from './SearchPage.types';
import { addFormData } from '../../D2Form/actions/form.actions';
import { actionCreator } from '../../../actions/actions.utils';
import { searchPageActionTypes } from './SearchPage.actions';

const buildSearchOption = (id, name, searchGroups, searchScope) => ({
    searchOptionId: id,
    searchOptionName: name,
    searchGroups: [...searchGroups.values()]
        .map(({ unique, searchForm, minAttributesRequiredToSearch }, index) => ({
            unique,
            searchForm,
            // We adding the `formId` here for the reason that we will use it in the SearchPage component.
            // Specifically the function `addFormData` will add an object for each input field to the store.
            // Also the formId is passed in the `Form` component and needs to be identical with the one in
            // the store in order for the `Form` to function. For these reasons we generate it once here.
            formId: `searchPageForm-${id}-${index}`,
            searchScope,
            minAttributesRequiredToSearch,
        })),
});

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

