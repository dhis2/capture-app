// @flow
import { useDispatch } from 'react-redux';
import React, { useCallback, useMemo, useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import { useLocationQuery } from '../../../utils/routing';
import { SearchPageComponent } from './SearchPage.component';
import { navigateToMainPage, openSearchPage } from './SearchPage.actions';
import { useTrackedEntityTypesWithCorrelatedPrograms } from '../../../hooks';
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
    const [showBulkDataEntryPlugin, setShowBulkDataEntryPlugin] = useState(false);
    const dispatch = useDispatch();
    const { programId, orgUnitId } = useLocationQuery();

    const onNavigateToMainPage = useCallback(
        () => { dispatch(navigateToMainPage()); },
        [dispatch]);
    const preselectedProgramId = usePreselectedProgram(programId);

    const onCloseBulkDataEntryPlugin = useCallback(() => (
        setShowBulkDataEntryPlugin(false)
    ), [setShowBulkDataEntryPlugin]);

    const onOpenBulkDataEntryPlugin = useCallback(() => (
        setShowBulkDataEntryPlugin(true)
    ), [setShowBulkDataEntryPlugin]);

    useEffect(() => {
        if (programId && (programId !== preselectedProgramId)) {
            // There is no search for Event type of programs.
            // In this case we navigate the users back to the main page
            onNavigateToMainPage();
        }
    }, [programId, preselectedProgramId, onNavigateToMainPage]);

    useEffect(() => {
        dispatch(openSearchPage());
    }, [dispatch]);

    return (
        <ResultsPageSizeContext.Provider value={{ resultsPageSize: 5 }}>
            <SearchPageComponent
                programId={programId}
                orgUnitId={orgUnitId}
                onNavigateToMainPage={onNavigateToMainPage}
                showBulkDataEntryPlugin={showBulkDataEntryPlugin}
                onOpenBulkDataEntryPlugin={onOpenBulkDataEntryPlugin}
                onCloseBulkDataEntryPlugin={onCloseBulkDataEntryPlugin}
            />
        </ResultsPageSizeContext.Provider>
    );
};
