// @flow
import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback } from 'react';
import type { ComponentType } from 'react';
import { NewPageComponent } from './NewPage.component';
import {
    showMessageToSelectOrgUnitOnNewPage,
    showDefaultViewOnNewPage,
    showMessageToSelectProgramCategoryOnNewPage, showMessageThatCategoryOptionIsInvalidForOrgUnit,
} from './NewPage.actions';
import { newPageStatuses } from './NewPage.constants';
import { useNavigate, buildUrlQueryString, useLocationQuery } from '../../../utils/routing';
import { getScopeFromScopeId, TrackerProgram, TrackedEntityType } from '../../../metaData';
import { useMissingCategoriesInProgramSelection } from '../../../hooks/useMissingCategoriesInProgramSelection';
import { dataEntryHasChanges } from '../../DataEntry/common/dataEntryHasChanges';
import { useTrackedEntityInstances } from './hooks';
import { deriveTeiName } from '../common/EnrollmentOverviewDomain/useTeiDisplayName';
import { programCollection } from '../../../metaDataMemoryStores/programCollection/programCollection';
import { useCategoryOptionIsValidForOrgUnit } from '../../../hooks/useCategoryComboIsValidForOrgUnit';
import { TopBar } from './TopBar.container';

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
    const { navigate } = useNavigate();
    const { orgUnitId, programId, teiId } = useLocationQuery();
    const program = programId && programCollection.get(programId);
    const { categoryOptionIsInvalidForOrgUnit } = useCategoryOptionIsValidForOrgUnit({
        selectedOrgUnitId: orgUnitId,
    });
    const { trackedEntityInstanceAttributes, loading: isTrackedEntityAttributesLoading } = useTrackedEntityInstances(teiId, programId);
    // $FlowFixMe
    const trackedEntityType = program?.trackedEntityType;
    const teiDisplayName =
        trackedEntityInstanceAttributes &&
        deriveTeiName(trackedEntityInstanceAttributes, trackedEntityType?.id || '', teiId);

    const dispatchShowMessageToSelectOrgUnitOnNewPage = useCallback(
        () => { dispatch(showMessageToSelectOrgUnitOnNewPage()); },
        [dispatch]);

    const dispatchShowMessageThatCategoryOptionIsInvalidForOrgUnit = useCallback(
        () => { dispatch(showMessageThatCategoryOptionIsInvalidForOrgUnit()); },
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
        useSelector(({ activePage }) => (!activePage.isDataEntryLoading)) && !isTrackedEntityAttributesLoading;

    const currentScopeId: string =
        useSelector(({ currentSelections }) => currentSelections.programId || currentSelections.trackedEntityTypeId);

    // This is combo category selection. When you have selected a program but
    // the selection is incomplete we want the user to see a specific message
    const { missingCategories, programSelectionIsIncomplete } = useMissingCategoriesInProgramSelection();

    const orgUnitSelectionIncomplete: boolean = useSelector(
        ({ currentSelections }) =>
            (program instanceof TrackerProgram) &&
            !currentSelections.orgUnitId &&
            !currentSelections.complete,
    );

    const newPageStatus: $Keys<typeof newPageStatuses> =
        useSelector(({ newPage }) => newPage.newPageStatus);

    const handleMainPageNavigation = () => {
        navigate(`/?${buildUrlQueryString({ orgUnitId, programId })}`);
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
        <>
            <TopBar
                orgUnitId={orgUnitId}
                programId={programId}
                isUserInteractionInProgress={isUserInteractionInProgress}
                teiId={teiId}
                trackedEntityName={trackedEntityType?.name}
                teiDisplayName={teiDisplayName}
                formIsOpen={newPageStatus === newPageStatuses.DEFAULT}
            />
            <NewPageComponent
                showMessageToSelectOrgUnitOnNewPage={dispatchShowMessageToSelectOrgUnitOnNewPage}
                showMessageToSelectProgramCategoryOnNewPage={dispatchShowMessageToSelectProgramCategoryOnNewPage}
                showDefaultViewOnNewPage={dispatchShowDefaultViewOnNewPage}
                showMessageThatCategoryOptionIsInvalidForOrgUnit={dispatchShowMessageThatCategoryOptionIsInvalidForOrgUnit}
                handleMainPageNavigation={handleMainPageNavigation}
                currentScopeId={currentScopeId}
                orgUnitSelectionIncomplete={orgUnitSelectionIncomplete}
                programCategorySelectionIncomplete={programSelectionIsIncomplete}
                missingCategoriesInProgramSelection={missingCategories}
                categoryOptionIsInvalidForOrgUnit={categoryOptionIsInvalidForOrgUnit}
                writeAccess={writeAccess}
                newPageStatus={newPageStatus}
                error={error}
                ready={ready}
                trackedEntityInstanceAttributes={trackedEntityInstanceAttributes}
                trackedEntityName={trackedEntityType?.name}
            />
        </>
    );
};
