// @flow
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import React, { useCallback } from 'react';
import type { ComponentType } from 'react';
import { NewPageComponent } from './NewPage.component';
import {
    showMessageToSelectOrgUnitOnNewPage,
    showDefaultViewOnNewPage,
    showMessageToSelectProgramCategoryOnNewPage,
} from './NewPage.actions';
import { typeof newPageStatuses } from './NewPage.constants';
import { buildUrlQueryString, useLocationQuery } from '../../../utils/routing';
import { getScopeFromScopeId, TrackerProgram, TrackedEntityType } from '../../../metaData';
import { useMissingCategoriesInProgramSelection } from '../../../hooks/useMissingCategoriesInProgramSelection';
import { dataEntryHasChanges } from '../../DataEntry/common/dataEntryHasChanges';
import { useTrackedEntityInstances } from './hooks';
import { deriveTeiName } from '../common/EnrollmentOverviewDomain/useTeiDisplayName';
import { programCollection } from '../../../metaDataMemoryStores/programCollection/programCollection';

const useUserWriteAccess = (scopeId) => {
    const scope = getScopeFromScopeId(scopeId);
    if (scopeId && !scope) {
        return false;
    }
    try {
        if (scope instanceof TrackerProgram) {
            const { access, trackedEntityType: { access: tetypeAccess } } = scope;
            const userHasWriteAccessForTheProgram = access && access.data && access.data.write;
            const userHasWriteAccessForTheTEType = tetypeAccess && tetypeAccess.data && tetypeAccess.data.write;

            return userHasWriteAccessForTheProgram && userHasWriteAccessForTheTEType;
        } else if (scope instanceof TrackedEntityType) {
            const { access } = scope;

            return access && access.data && access.data.write;
        }
        return true;
    } catch (e) {
        return false;
    }
};
export const NewPage: ComponentType<{||}> = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { orgUnitId, programId, teiId } = useLocationQuery();
    const program = programId && programCollection.get(programId);
    const { trackedEntityInstanceAttributes } = useTrackedEntityInstances(teiId, programId);
    // $FlowFixMe
    const trackedEntityType = program?.trackedEntityType;
    const teiDisplayName =
        trackedEntityInstanceAttributes &&
        deriveTeiName(trackedEntityInstanceAttributes, trackedEntityType?.id || '', teiId);

    const dispatchShowMessageToSelectOrgUnitOnNewPage = useCallback(
        () => { dispatch(showMessageToSelectOrgUnitOnNewPage()); },
        [dispatch]);

    const dispatchShowMessageToSelectProgramCategoryOnNewPage = useCallback(
        () => { dispatch(showMessageToSelectProgramCategoryOnNewPage()); },
        [dispatch]);

    const dispatchShowDefaultViewOnNewPage = useCallback(
        () => { dispatch(showDefaultViewOnNewPage()); },
        [dispatch]);

    const error: boolean =
        useSelector(({ activePage }) => activePage.selectionsError && activePage.selectionsError.error);

    const ready: boolean =
        useSelector(({ activePage }) => (!activePage.isDataEntryLoading));

    const currentScopeId: string =
        useSelector(({ currentSelections }) => currentSelections.programId || currentSelections.trackedEntityTypeId);

    // This is combo category selection. When you have selected a program but
    // the selection is incomplete we want the user to see a specific message
    const { missingCategories, programSelectionIsIncomplete } = useMissingCategoriesInProgramSelection();

    const orgUnitSelectionIncomplete: boolean = useSelector(
        ({ currentSelections }) => !currentSelections.orgUnitId && !currentSelections.complete,
    );

    const newPageStatus: $Keys<newPageStatuses> =
        useSelector(({ newPage }) => newPage.newPageStatus);

    const handleMainPageNavigation = () => {
        history.push(`/?${buildUrlQueryString({ orgUnitId, programId })}`);
    };

    const writeAccess = useUserWriteAccess(currentScopeId);

    const isUserInteractionInProgress: boolean = useSelector(
        state =>
            dataEntryHasChanges(state, 'singleEvent-newEvent')
          || dataEntryHasChanges(state, 'relationship-newTei')
          || dataEntryHasChanges(state, 'relationship-newEvent')
          || dataEntryHasChanges(state, 'newPageDataEntryId-newEnrollment')
          || dataEntryHasChanges(state, 'newPageDataEntryId-newTei'),
    );

    return (
        <NewPageComponent
            showMessageToSelectOrgUnitOnNewPage={dispatchShowMessageToSelectOrgUnitOnNewPage}
            showMessageToSelectProgramCategoryOnNewPage={dispatchShowMessageToSelectProgramCategoryOnNewPage}
            showDefaultViewOnNewPage={dispatchShowDefaultViewOnNewPage}
            handleMainPageNavigation={handleMainPageNavigation}
            currentScopeId={currentScopeId}
            orgUnitSelectionIncomplete={orgUnitSelectionIncomplete}
            programCategorySelectionIncomplete={programSelectionIsIncomplete}
            missingCategoriesInProgramSelection={missingCategories}
            writeAccess={writeAccess}
            newPageStatus={newPageStatus}
            error={error}
            ready={ready}
            isUserInteractionInProgress={isUserInteractionInProgress}
            programId={programId}
            teiId={teiId}
            trackedEntityInstanceAttributes={trackedEntityInstanceAttributes}
            trackedEntityName={trackedEntityType?.name}
            teiDisplayName={teiDisplayName}
        />);
};
