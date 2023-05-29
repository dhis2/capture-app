// @flow
// $FlowFixMe
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import React, { useCallback } from 'react';
import { SearchBoxComponent } from './SearchBox.component';
import {
    cleanSearchRelatedData,
    navigateToNewTrackedEntityPage,
    showInitialViewOnSearchBox,
} from './SearchBox.actions';
import { useCurrentTrackedEntityTypeId } from '../../hooks';
import { ResultsPageSizeContext } from '../Pages/shared-contexts';
import { usePreselectedProgram } from './hooks';

export const SearchBox = ({ programId }: { programId: string }) => {
    const dispatch = useDispatch();
    const trackedEntityTypeId = useCurrentTrackedEntityTypeId();
    const preselectedProgramId = usePreselectedProgram(programId);

    const dispatchShowInitialSearchBox = useCallback(
        () => { dispatch(showInitialViewOnSearchBox()); },
        [dispatch]);
    const dispatchCleanSearchRelatedData = useCallback(
        () => { dispatch(cleanSearchRelatedData()); },
        [dispatch]);
    const dispatchNavigateToNewTrackedEntityPage = useCallback(() => {
        dispatch(navigateToNewTrackedEntityPage());
    }, [dispatch]);

    const { searchStatus, searchableFields, minAttributesRequiredToSearch } = useSelector(
        ({ searchDomain }) => ({
            searchStatus: searchDomain.searchStatus,
            searchableFields: searchDomain.searchableFields,
            minAttributesRequiredToSearch: searchDomain.minAttributesRequiredToSearch,
        }),
        shallowEqual,
    );

    return (
        <ResultsPageSizeContext.Provider value={{ resultsPageSize: 5 }}>
            <SearchBoxComponent
                showInitialSearchBox={dispatchShowInitialSearchBox}
                cleanSearchRelatedInfo={dispatchCleanSearchRelatedData}
                navigateToRegisterTrackedEntity={dispatchNavigateToNewTrackedEntityPage}
                preselectedProgramId={preselectedProgramId}
                trackedEntityTypeId={trackedEntityTypeId}
                searchStatus={searchStatus}
                minAttributesRequiredToSearch={minAttributesRequiredToSearch}
                searchableFields={searchableFields}
                ready={searchStatus}
            />
        </ResultsPageSizeContext.Provider>
    );
};
