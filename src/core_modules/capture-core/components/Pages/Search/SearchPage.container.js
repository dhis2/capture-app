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

export const searchPageActionTypes = {
    VIA_UNIQUE_ID_ON_SCOPE_PROGRAM_SEARCH: 'SearchViaUniqueIdOnScopeProgram',
    VIA_UNIQUE_ID_ON_SCOPE_TRACKED_ENTITY_TYPE_SEARCH: 'SearchViaUniqueIdOnScopeTrackedEntityType',
    VIA_ATTRIBUTES_ON_SCOPE_PROGRAM_SEARCH: 'SearchViaAttributesOnScopeProgram',
    VIA_ATTRIBUTES_ON_SCOPE_TRACKED_ENTITY_TYPE_SEARCH: 'SearchViaAttributesOnScopeTrackedEntityType',
    SEARCH_RESULTS_LOADING: 'SearchResultsLoading',
    SEARCH_RESULTS_EMPTY: 'SearchResultsEmpty',
    SEARCH_RESULTS_SUCCESS: 'SearchResultsSuccess',
    SEARCH_RESULTS_ERROR: 'SearchResultsError',
    MODAL_CLOSE: 'CloseModal',
};

export const searchScopes = {
    PROGRAM: 'PROGRAM',
    TRACKED_ENTITY_TYPE: 'TRACKED_ENTITY_TYPE',
};

const mapStateToProps = (state: ReduxState): PropsFromRedux => {
    const { currentSelections, activePage, searchPage: { searchStatus, searchResults, errorMessage } } = state;

    const trackedEntityTypesWithCorrelatedPrograms =
      [...programCollection.values()]
          .filter(program => program instanceof TrackerProgram)
          // $FlowFixMe
          .reduce((acc, {
              id: programId,
              name: programName,
              trackedEntityType: {
                  id: trackedEntityTypeId,
                  name: trackedEntityTypeName,
                  searchGroups: trackedEntityTypeSearchGroups,
              },
              searchGroups,
          }: TrackerProgram) => {
              const accumulatedProgramsOfTrackedEntityType =
                acc[trackedEntityTypeId] ? acc[trackedEntityTypeId].programs : [];
              return {
                  ...acc,
                  [trackedEntityTypeId]: {
                      trackedEntityTypeId,
                      trackedEntityTypeName,
                      trackedEntityTypeSearchGroups,
                      programs: [
                          ...accumulatedProgramsOfTrackedEntityType,
                          { programId, programName, searchGroups },
                      ],

                  },
              };
          }, {});

    const preselectedProgram = Object.values(trackedEntityTypesWithCorrelatedPrograms)
        // $FlowFixMe https://github.com/facebook/flow/issues/2221
        .map(({ programs }) =>
            programs.find(({ programId }) => programId === currentSelections.programId))
        .filter(program => program)[0];

    const availableSearchOptions = Object.values(trackedEntityTypesWithCorrelatedPrograms)
        // $FlowFixMe https://github.com/facebook/flow/issues/2221
        .reduce((acc, { trackedEntityTypeId, trackedEntityTypeName, trackedEntityTypeSearchGroups, programs }) => ({
            ...acc,
            [trackedEntityTypeId]: buildSearchOption(trackedEntityTypeId, trackedEntityTypeName, trackedEntityTypeSearchGroups, searchScopes.TRACKED_ENTITY_TYPE),
            ...programs.reduce((accumulated, { programId, programName, searchGroups }) => ({
                ...accumulated,
                [programId]: buildSearchOption(programId, programName, searchGroups, searchScopes.PROGRAM),
            }), {}),
        }), {});


    return {
        preselectedProgram: {
            value: preselectedProgram && preselectedProgram.programId,
            label: preselectedProgram && preselectedProgram.programName,
        },
        availableSearchOptions,
        trackedEntityTypesWithCorrelatedPrograms,
        error: activePage.selectionsError && activePage.selectionsError.error,
        ready: !activePage.isLoading,
        searchStatus,
        searchResults,
        searchResultsErrorMessage: errorMessage,
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch): DispatchersFromRedux => ({
    addFormIdToReduxStore: (formId) => { dispatch(addFormData(formId)); },
    closeModal: () => { dispatch(actionCreator(searchPageActionTypes.MODAL_CLOSE)()); },
});

export const SearchPage =
  compose(
      connect<Props, OwnProps, _, _, _, _>(mapStateToProps, mapDispatchToProps),
      withLoadingIndicator(),
      withErrorMessageHandler(),
  )(SearchPageComponent);

