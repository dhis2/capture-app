// @flow
// $FlowFixMe
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import React, { useCallback } from 'react';
import { useLocationQuery } from '../../utils/routing';
import { SearchBoxComponent } from './SearchBox.component';
import { cleanSearchRelatedData, navigateToNewUserPage, showInitialViewOnSearchBox } from './SearchBox.actions';
import { useCurrentTrackedEntityTypeId } from '../../hooks';
import { ResultsPageSizeContext } from '../Pages/shared-contexts';
import { usePreselectedProgram } from './hooks';
import type { ContainerProps } from './SearchBox.types';

export const SearchBox = ({
    dispatchNavigateToMainPage,
}: ContainerProps) => {
    const dispatch = useDispatch();
    const { programId } = useLocationQuery();
    const trackedEntityTypeId = useCurrentTrackedEntityTypeId();
    const preselectedProgramId = usePreselectedProgram(programId);

    const dispatchShowInitialSearchBox = useCallback(
        () => { dispatch(showInitialViewOnSearchBox()); },
        [dispatch]);
    const dispatchCleanSearchRelatedData = useCallback(
        () => { dispatch(cleanSearchRelatedData()); },
        [dispatch]);
    const dispatchNavigateToNewUserPage = useCallback(() => { dispatch(navigateToNewUserPage()); }, [dispatch]);

    const { searchStatus, error, ready, searchableFields, minAttributesRequiredToSearch } = useSelector(
        ({ searchDomain, activePage }) => ({
            searchStatus: searchDomain.searchStatus,
            ready: !activePage.isLoading && !activePage.lockedSelectorLoads,
            error: activePage.selectionsError && activePage.selectionsError.error,
            searchableFields: searchDomain.searchableFields,
            minAttributesRequiredToSearch: searchDomain.minAttributesRequiredToSearch,
        }),
        shallowEqual,
    );

    return (
        <ResultsPageSizeContext.Provider value={{ resultsPageSize: 5 }}>
            <SearchBoxComponent
                navigateToMainPage={dispatchNavigateToMainPage}
                showInitialSearchBox={dispatchShowInitialSearchBox}
                cleanSearchRelatedInfo={dispatchCleanSearchRelatedData}
                navigateToRegisterUser={dispatchNavigateToNewUserPage}
                preselectedProgramId={preselectedProgramId}
                trackedEntityTypeId={trackedEntityTypeId}
                searchStatus={searchStatus}
                minAttributesRequiredToSearch={minAttributesRequiredToSearch}
                searchableFields={searchableFields}
                error={error}
                ready={ready}
            />
        </ResultsPageSizeContext.Provider>
    );
};
