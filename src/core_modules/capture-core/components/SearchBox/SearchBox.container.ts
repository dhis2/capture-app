import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchBoxComponent } from './SearchBox.component';
import { cleanSearchRelatedData, showInitialViewOnSearchBox } from './SearchBox.actions';
import { useCurrentTrackedEntityTypeId } from '../../hooks/useCurrentTrackedEntityTypeId';
import { usePreselectedProgram } from './hooks';
import { setPrepopulateDataOnNewPage } from '../Pages/New/NewPage.actions';

export const SearchBox = ({ programId }: { programId: string }) => {
    const dispatch = useDispatch();
    const trackedEntityTypeId = useCurrentTrackedEntityTypeId();
    const preselectedProgramId = usePreselectedProgram(programId);

    const {
        searchStatus,
        minAttributesRequiredToSearch,
        searchableFields,
    } = useSelector((state: any) => ({
        searchStatus: state.searchDomain?.searchStatus,
        minAttributesRequiredToSearch: state.searchDomain?.minAttributesRequiredToSearch,
        searchableFields: state.searchDomain?.searchableFields,
    }));

    const handleCleanSearchRelatedData = () => {
        dispatch(cleanSearchRelatedData());
    };

    const handleShowInitialSearchBox = () => {
        dispatch(showInitialViewOnSearchBox());
    };

    const handleNavigateToRegisterTrackedEntity = (currentSearchTerms) => {
        dispatch(setPrepopulateDataOnNewPage({
            trackedEntityTypeId,
            programId: preselectedProgramId,
            currentSearchTerms,
        }));
    };

    return React.createElement(SearchBoxComponent, {
        searchStatus,
        preselectedProgramId,
        cleanSearchRelatedInfo: handleCleanSearchRelatedData,
        showInitialSearchBox: handleShowInitialSearchBox,
        navigateToRegisterTrackedEntity: () => handleNavigateToRegisterTrackedEntity({}),
        minAttributesRequiredToSearch,
        searchableFields,
        trackedEntityTypeId,
        ready: true,
    });
};
