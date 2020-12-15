// @flow
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import React, { useCallback } from 'react';
import type { ComponentType } from 'react';
import { NewPageComponent } from './NewPage.component';
import {
    showMessageToSelectOrgUnitOnNewPage,
    showDefaultViewOnNewPage,
    showMessageToSelectProgramPartnerOnNewPage,
} from './NewPage.actions';
import { typeof newPageStatuses } from './NewPage.constants';
import { urlArguments } from '../../../utils/url';
import { useCurrentOrgUnitInfo } from '../../../hooks/useCurrentOrgUnitInfo';
import { useCurrentProgramInfo } from '../../../hooks/useCurrentProgramInfo';

export const NewPage: ComponentType<{||}> = () => {
    const dispatch = useDispatch();
    const history = useHistory();

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
        useSelector(({ activePage }) => !activePage.isPageLoading && !activePage.isDataEntryLoading);

    const currentScopeId: string =
        useSelector(({ currentSelections }) => currentSelections.programId || currentSelections.trackedEntityTypeId);

    // This is partner selection. When you have selected a program but
    // the selection is incomplete we want the user to see a specific message
    const partnerSelectionIncomplete: boolean =
      useSelector(({ currentSelections: { programId, complete } }) => programId && !complete);

    const orgUnitSelectionIncomplete: boolean =
      useSelector(({ currentSelections: { orgUnitId, complete } }) => !orgUnitId && !complete);

    const newPageStatus: $Keys<newPageStatuses> =
        useSelector(({ newPage }) => newPage.newPageStatus);

    const { id: orgUnitId } = useCurrentOrgUnitInfo();
    const { id: programId } = useCurrentProgramInfo();
    const handleMainPageNavigation = () => {
        history.push(`/${urlArguments({ orgUnitId, programId })}`);
    };

    return (
        <NewPageComponent
            showMessageToSelectOrgUnitOnNewPage={dispatchShowMessageToSelectOrgUnitOnNewPage}
            showMessageToSelectProgramPartnerOnNewPage={dispatchShowMessageToSelectProgramPartnerOnNewPage}
            showDefaultViewOnNewPage={dispatchShowDefaultViewOnNewPage}
            handleMainPageNavigation={handleMainPageNavigation}
            currentScopeId={currentScopeId}
            orgUnitSelectionIncomplete={orgUnitSelectionIncomplete}
            partnerSelectionIncomplete={partnerSelectionIncomplete}
            newPageStatus={newPageStatus}
            error={error}
            ready={ready}
        />);
};
