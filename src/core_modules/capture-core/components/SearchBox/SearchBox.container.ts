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
import { setPrepopulateDataOnNewPage } from '../Pages/New/NewPage.actions';
import { filteredRangeForPrepopulation } from './hooks/prepopulateRangeFilter';
import { CurrentSearchTerms } from './SearchForm/SearchForm.types';

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
    const dispatchNavigateToNewTrackedEntityPage = useCallback((currentSearchTerms: CurrentSearchTerms) => {
        const filteredSearchTerms = filteredRangeForPrepopulation(currentSearchTerms);
        dispatch(setPrepopulateDataOnNewPage(filteredSearchTerms));
        dispatch(navigateToNewTrackedEntityPage());
    }, [dispatch]);

    const { searchStatus, searchableFields, minAttributesRequiredToSearch } = useSelector(
        ({ searchDomain }: any) => ({
            searchStatus: searchDomain.searchStatus,
            searchableFields: searchDomain.searchableFields,
            minAttributesRequiredToSearch: searchDomain.minAttributesRequiredToSearch,
        }),
        shallowEqual,
    );

    return React.createElement(ResultsPageSizeContext.Provider,
        { value: { resultsPageSize: 5 } },
        React.createElement(SearchBoxComponent, {
            showInitialSearchBox: dispatchShowInitialSearchBox,
            cleanSearchRelatedInfo: dispatchCleanSearchRelatedData,
            navigateToRegisterTrackedEntity: dispatchNavigateToNewTrackedEntityPage,
            preselectedProgramId,
            trackedEntityTypeId,
            searchStatus,
            minAttributesRequiredToSearch,
            searchableFields,
            ready: searchStatus,
        }),
    );
};
