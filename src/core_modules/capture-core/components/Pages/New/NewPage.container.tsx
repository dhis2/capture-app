import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useState } from 'react';
import type { ComponentType } from 'react';
import { v4 as uuid } from 'uuid';
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
import { useTrackedEntityAttributes } from './hooks';
import { deriveTeiName } from '../common/EnrollmentOverviewDomain/useTeiDisplayName';
import { programCollection } from '../../../metaDataMemoryStores/programCollection/programCollection';
import { useCategoryOptionIsValidForOrgUnit } from '../../../hooks/useCategoryComboIsValidForOrgUnit';
import { TopBar } from './TopBar.container';

const useUserWriteAccess = (scopeId: string) => {
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

export const NewPage: ComponentType<Record<string, never>> = () => {
    const dispatch = useDispatch();
    const { navigate } = useNavigate();
    const { orgUnitId, programId, teiId } = useLocationQuery();
    const program = programId ? programCollection.get(programId) : undefined;
    const { categoryOptionIsInvalidForOrgUnit } = useCategoryOptionIsValidForOrgUnit({
        selectedOrgUnitId: orgUnitId,
    });
    const { trackedEntityAttributes, loading: isTrackedEntityAttributesLoading } =
        useTrackedEntityAttributes(teiId, programId);
    const trackedEntityType = program?.trackedEntityType;
    const teiDisplayName =
    trackedEntityAttributes &&
        deriveTeiName(trackedEntityAttributes, trackedEntityType?.id || '', teiId);

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
        useSelector(({ activePage }: any) => activePage.selectionsError && activePage.selectionsError.error);

    const ready: boolean =
        useSelector(({ activePage }: any) => (!activePage.isDataEntryLoading)) && !isTrackedEntityAttributesLoading;

    const currentScopeId: string =
        useSelector(({ currentSelections }: any) => currentSelections.programId || currentSelections.trackedEntityTypeId);

    const { missingCategories, programSelectionIsIncomplete } = useMissingCategoriesInProgramSelection();

    const orgUnitSelectionIncomplete: boolean = useSelector(
        ({ currentSelections }: any) => !currentSelections.orgUnitId && !currentSelections.complete,
    );

    const newPageStatus: keyof typeof newPageStatuses =
        useSelector(({ newPage }: any) => newPage.newPageStatus);

    const handleMainPageNavigation = () => {
        navigate(`/?${buildUrlQueryString({ orgUnitId, programId })}`);
    };

    const writeAccess = useUserWriteAccess(currentScopeId);

    const isUserInteractionInProgress: boolean = useSelector(
        (state: any) =>
            dataEntryHasChanges(state, 'singleEvent-newEvent')
          || dataEntryHasChanges(state, 'relationship-newTei')
          || dataEntryHasChanges(state, 'relationship-newEvent')
          || dataEntryHasChanges(state, 'newPageDataEntryId-newEnrollment')
          || dataEntryHasChanges(state, 'newPageDataEntryId-newTei'),
    );

    const [newPageKey, setNewPageKey] = useState<string>();
    const onOpenNewRegistrationPage = () => {
        setNewPageKey(uuid());
    };

    return (
        <>
            <TopBar
                orgUnitId={orgUnitId}
                programId={programId}
                program={program}
                isUserInteractionInProgress={isUserInteractionInProgress}
                teiId={teiId}
                trackedEntityName={trackedEntityType?.name}
                teiDisplayName={teiDisplayName}
                formIsOpen={newPageStatus === newPageStatuses.DEFAULT}
                onOpenNewRegistrationPage={onOpenNewRegistrationPage}
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
                trackedEntityInstanceAttributes={trackedEntityAttributes}
                trackedEntityName={trackedEntityType?.name}
                newPageKey={newPageKey}
            />
        </>
    );
};
