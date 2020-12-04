// @flow
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback } from 'react';
import type { ComponentType } from 'react';
import { NewPageComponent } from './NewPage.component';
import { showMessageToSelectOrgUnitOnNewPage, showDefaultViewOnNewPage } from './NewPage.actions';
import { typeof newPageStatuses } from './NewPage.constants';

export const NewPage: ComponentType<{||}> = () => {
    const dispatch = useDispatch();

    const dispatchShowMessageToSelectOrgUnitOnNewPage = useCallback(
        () => { dispatch(showMessageToSelectOrgUnitOnNewPage()); },
        [dispatch]);

    const dispatchShowDefaultViewOnNewPage = useCallback(
        () => { dispatch(showDefaultViewOnNewPage()); },
        [dispatch]);

    const error: boolean =
        useSelector(({ activePage }) => activePage.selectionsError && activePage.selectionsError.error);

    const ready: boolean =
        useSelector(({ activePage }) => !activePage.isLoading);

    const currentScopeId: string =
        useSelector(({ currentSelections }) => currentSelections.programId || currentSelections.trackedEntityTypeId);

    const selectionsIncomplete: boolean =
      useSelector(({ currentSelections }) => !currentSelections.complete);

    const newPageStatus: $Keys<newPageStatuses> =
        useSelector(({ newPage }) => newPage.newPageStatus);

    return (
        <NewPageComponent
            showMessageToSelectOrgUnitOnNewPage={dispatchShowMessageToSelectOrgUnitOnNewPage}
            showDefaultViewOnNewPage={dispatchShowDefaultViewOnNewPage}
            currentScopeId={currentScopeId}
            selectionsIncomplete={selectionsIncomplete}
            newPageStatus={newPageStatus}
            error={error}
            ready={ready}
        />);
};
