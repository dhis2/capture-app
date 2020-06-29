// @flow
import { connect } from 'react-redux';
import { SearchPage as SearchPageComponent } from './SearchPage.component';
import { programCollection } from '../../../metaDataMemoryStores';
import { TrackerProgram } from '../../../metaData/Program';
import { withErrorMessageHandler, withLoadingIndicator } from '../../../HOC';
import type { ActionsFromRedux, PropsFromRedux } from './SearchPage.types';
import { addFormData } from '../../D2Form/actions/form.actions';
import { actionCreator } from '../../../actions/actions.utils';


export const searchPageActionTypes = {
    ON_SEARCH: 'OnSearch',
    SEARCH_RESULTS_EMPTY: 'SearchResultsEmpty',
    MODAL_CLOSE: 'CloseModal',
};

const mapStateToProps = (state: ReduxState): PropsFromRedux => {
    const { currentSelections, activePage, searchPage: { searchStatus } } = state;

    const trackedEntityTypesWithCorrelatedPrograms =
      [...programCollection.values()]
          .filter(program => program instanceof TrackerProgram)
          .reduce((acc, {
              id: programId,
              name: programName,
              trackedEntityType: { id: trackedEntityTypeId, name: trackedEntityTypeName },
              searchGroups,
          }) => {
              const accumulatedProgramsOfTrackedEntityType =
                acc[trackedEntityTypeId] ? acc[trackedEntityTypeId].programs : [];
              return {
                  ...acc,
                  [trackedEntityTypeId]: {
                      trackedEntityTypeId,
                      trackedEntityTypeName,
                      programs: [
                          ...accumulatedProgramsOfTrackedEntityType,
                          { programId, programName, searchGroups },
                      ],

                  },
              };
          }, {});

    const preselectedProgram = Object.values(trackedEntityTypesWithCorrelatedPrograms)
        // $FlowSuppress https://github.com/facebook/flow/issues/2221
        .map(({ programs }) =>
            programs.find(({ programId }) => programId === currentSelections.programId))
        .filter(program => program)[0];

    const programs = Object.values(trackedEntityTypesWithCorrelatedPrograms)
        // $FlowSuppress https://github.com/facebook/flow/issues/2221
        .flatMap(({ programs: tePrograms }) => tePrograms)
        .reduce((acc, { programId, programName, searchGroups }) => ({
            ...acc,
            [programId]: {
                programId,
                programName,
                // TODO add comment we want the forms to have an id so that it can be used
                searchGroups: [...searchGroups.values()]
                    .map(({ unique, searchForm }, index) => ({
                        unique,
                        searchForm,
                        formId: `searchPageForm-${programId}-${index}`,
                    })),
            },
        }), {});


    return {
        preselectedProgram: {
            value: preselectedProgram && preselectedProgram.programId,
            label: preselectedProgram && preselectedProgram.programName,
        },
        programs,
        forms: state.forms,
        trackedEntityTypesWithCorrelatedPrograms,
        error: activePage.selectionsError && activePage.selectionsError.error,
        ready: !activePage.isLoading,
        searchStatus,
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch): ActionsFromRedux => ({
    handleOnSearch: ({ selectedProgramId, formId }) => {
        dispatch(actionCreator(searchPageActionTypes.ON_SEARCH)({ selectedProgramId, formId }));
    },
    addFormIdToReduxStore: (formId) => { dispatch(addFormData(formId)); },
    closeModal: () => { dispatch(actionCreator(searchPageActionTypes.MODAL_CLOSE)()); },
});


export const SearchPage = connect(mapStateToProps, mapDispatchToProps)(withLoadingIndicator()(withErrorMessageHandler()(SearchPageComponent)));
