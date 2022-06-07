// @flow
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import React, { useCallback, useEffect } from 'react';
import { NewPageComponent } from './NewPage.component';
import {
    showMessageToSelectOrgUnitOnNewPage,
    showDefaultViewOnNewPage,
    showMessageToSelectProgramCategoryOnNewPage,
} from './NewPage.actions';
import { typeof newPageStatuses } from './NewPage.constants';
import { urlArguments } from '../../../utils/url';
import { useCurrentOrgUnitInfo } from '../../../hooks/useCurrentOrgUnitInfo';
import { useCurrentProgramInfo } from '../../../hooks/useCurrentProgramInfo';
import { getScopeFromScopeId, TrackerProgram, TrackedEntityType } from '../../../metaData';
import { useMissingCategoriesInProgramSelection } from '../../../hooks/useMissingCategoriesInProgramSelection';
import { dataEntryHasChanges } from '../../DataEntry/common/dataEntryHasChanges';

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

type Props = {|
    enforceNewPage: () => void,
    enableMainPage: () => void,
|};
export const NewPage = ({ enforceNewPage, enableMainPage }: Props) => {
    const dispatch = useDispatch();
    const history = useHistory();

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

    const orgUnitSelectionIncomplete: boolean =
      useSelector(({ currentSelections: { orgUnitId, complete }, router: { location: { query } } }) => !(query.orgUnitId || orgUnitId) && !complete);

    const newPageStatus: $Keys<newPageStatuses> =
        useSelector(({ newPage }) => newPage.newPageStatus);

    const { id: orgUnitId } = useCurrentOrgUnitInfo();
    const { id: programId } = useCurrentProgramInfo();
    const handleMainPageNavigation = () => {
        enableMainPage();
        history.push(`/?${urlArguments({ orgUnitId, programId })}`);
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

    useEffect(() => {
        enforceNewPage();
    }, [enforceNewPage]);

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
        />);
};
