// @flow
import { useDispatch } from 'react-redux';
import React, { useCallback, useMemo, useEffect } from 'react';
import type { ComponentType } from 'react';
import { useLocationQuery } from '../../../utils/routing';
import { SearchBox } from '../../SearchBox';
import {
    navigateToMainPage,
    openSearchPage,
} from './SearchPage.actions';
import {
    useTrackedEntityTypesWithCorrelatedPrograms,
} from '../../../hooks';
import { TopBar } from './TopBar.container';
import { ResultsPageSizeContext } from '../shared-contexts';

const usePreselectedProgram = (currentSelectionsId): ?string => {
    const trackedEntityTypesWithCorrelatedPrograms = useTrackedEntityTypesWithCorrelatedPrograms();

    return useMemo(() => {
        const { programId } =
          Object.values(trackedEntityTypesWithCorrelatedPrograms)
              // $FlowFixMe https://github.com/facebook/flow/issues/2221
              .map(({ programs }) =>
                  programs.find(({ programId: currentProgramId }) => currentProgramId === currentSelectionsId))
              .filter(program => program)[0]
            || {};

        return programId;
    }, [currentSelectionsId, trackedEntityTypesWithCorrelatedPrograms],
    );
};

export const SearchPage: ComponentType<{||}> = () => {
    const dispatch = useDispatch();
    const { programId, orgUnitId } = useLocationQuery();

    const dispatchNavigateToMainPage = useCallback(
        () => { dispatch(navigateToMainPage()); },
        [dispatch]);
    const preselectedProgramId = usePreselectedProgram(programId);

    useEffect(() => {
        if (programId && (programId !== preselectedProgramId)) {
            // There is no search for Event type of programs.
            // In this case we navigate the users back to the main page
            dispatchNavigateToMainPage();
        }
    }, [programId, preselectedProgramId, dispatchNavigateToMainPage]);

    useEffect(() => {
        dispatch(openSearchPage());
    }, [dispatch]);

    return (
        <ResultsPageSizeContext.Provider value={{ resultsPageSize: 5 }}>
            <TopBar programId={programId} orgUnitId={orgUnitId} />
            <SearchBox dispatchNavigateToMainPage={dispatchNavigateToMainPage} />
        </ResultsPageSizeContext.Provider>
    );
};
