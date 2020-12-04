// @flow
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback } from 'react';
import type { ComponentType } from 'react';
import { NewPageComponent } from './NewPage.component';
import {
    showMessageToSelectOrgUnitOnNewPage,
    showDefaultViewOnNewPage,
    showMessageToSelectProgramPartnerOnNewPage,
} from './NewPage.actions';
import { typeof newPageStatuses } from './NewPage.constants';
import { useCurrentOrgUnitInfo } from '../../../hooks/useCurrentOrgUnitInfo';

export const NewPage: ComponentType<{||}> = () => {
    const dispatch = useDispatch();

    const dispatchShowMessageToSelectOrgUnitOnNewPage = useCallback(
        () => { dispatch(showMessageToSelectOrgUnitOnNewPage()); },
        [dispatch]);

    const dispatchShowMessageToSelectProgramPartnerOnNewPage = useCallback(
        () => { dispatch(showMessageToSelectProgramPartnerOnNewPage()); },
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

    const partnerSelectionIncomplete: boolean =
      useSelector(({ currentSelections: { programId, complete } }) => programId && !complete);

    const { id: currentOrgUnitId } = useCurrentOrgUnitInfo();

    const newPageStatus: $Keys<newPageStatuses> =
        useSelector(({ newPage }) => newPage.newPageStatus);

    return (
        <NewPageComponent
            showMessageToSelectOrgUnitOnNewPage={dispatchShowMessageToSelectOrgUnitOnNewPage}
            showMessageToSelectProgramPartnerOnNewPage={dispatchShowMessageToSelectProgramPartnerOnNewPage}
            showDefaultViewOnNewPage={dispatchShowDefaultViewOnNewPage}
            currentScopeId={currentScopeId}
            orgUnitSelectionIncomplete={!currentOrgUnitId}
            partnerSelectionIncomplete={partnerSelectionIncomplete}
            newPageStatus={newPageStatus}
            error={error}
            ready={ready}
        />);
};
