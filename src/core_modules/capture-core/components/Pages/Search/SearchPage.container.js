// @flow
import { connect } from 'react-redux';
import { SearchPage as SearchPageComponent } from './SearchPage.component';
import { programCollection } from '../../../metaDataMemoryStores';
import { TrackerProgram } from '../../../metaData/Program';
import { withErrorMessageHandler, withLoadingIndicator } from '../../../HOC';
import type { PropsFromRedux } from './SearchPage.types';

const mapStateToProps = (state: ReduxState): PropsFromRedux => {
    const { currentSelections, activePage } = state;

    const trackedEntityTypesWithCorrelatedPrograms =
      [...programCollection.values()]
          .filter(program => program instanceof TrackerProgram)
          // $FlowFixMe
          .reduce((acc, {
              id: programId,
              name: programName,
              trackedEntityType: { id: trackedEntityTypeId, name: trackedEntityTypeName },
              searchGroups,
          }: TrackerProgram) => {
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
        // $FlowFixMe https://github.com/facebook/flow/issues/2221
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
                // We adding the `formId` here for the reason that we will use it in the SearchPage component.
                // Specifically the function `addFormData` will add an object for each input field to the store.
                // Also the formId is passed in the `Form` component and needs to be identical with the one in
                // the store in order for the `Form` to function. For these reasons we generate it once here.
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
    };
};

export const SearchPage = connect(mapStateToProps)(withLoadingIndicator()(withErrorMessageHandler()(SearchPageComponent)));
