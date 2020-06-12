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
      Array.from(programCollection.values())
          .filter(program => program instanceof TrackerProgram)
          .reduce((acc, {
              _id: programId,
              _name: programName,
              _icon: programIcon,
              _trackedEntityType: { _id: trackedEntityTypeId, _name: trackedEntityTypeName },
          }) => {
              const accumulatedProgramsOfTrackedEntityType =
                acc[trackedEntityTypeId] ? acc[trackedEntityTypeId].programs : [];

              return {
                  ...acc,
                  [trackedEntityTypeId]: {
                      trackedEntityTypeId,
                      trackedEntityTypeName,
                      programs: [
                          ...accumulatedProgramsOfTrackedEntityType, { programId, programIcon, programName },
                      ],
                  },
              };
          }, {});

    const preselectedProgram = Object.values(trackedEntityTypesWithCorrelatedPrograms)
        // $FlowSuppress https://github.com/facebook/flow/issues/2221
        .map(({ programs }) =>
            programs.find(({ programId }) => programId === currentSelections.programId))
        .filter(program => program)[0];

    return {
        preselectedProgram: {
            value: preselectedProgram && preselectedProgram.programId,
            label: preselectedProgram && preselectedProgram.programName,
        },
        trackedEntityTypesWithCorrelatedPrograms,
        error: activePage.selectionsError && activePage.selectionsError.error,
        ready: !activePage.isLoading,
    };
};

export const SearchPage = connect(mapStateToProps)(withLoadingIndicator()(withErrorMessageHandler()(SearchPageComponent)));
