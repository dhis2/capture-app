// @flow
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import React, { useCallback } from 'react';
import type { ComponentType } from 'react';
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
import type { ProgramCategories } from './NewPage.types';
import { programCollection } from '../../../metaDataMemoryStores';


const useUserWriteAccess = (scopeId) => {
    const scope = getScopeFromScopeId(scopeId);
    if (scopeId && !scope) {
        return false;
    }
    try {
        if (scope instanceof TrackerProgram) {
            const { access } = scope;

            return access && access.data && access.data.write;
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
        useSelector(({ activePage }) => !activePage.isPageLoading && !activePage.isDataEntryLoading);

    const currentScopeId: string =
        useSelector(({ currentSelections }) => currentSelections.programId || currentSelections.trackedEntityTypeId);

    // This is combo category selection. When you have selected a program but
    // the selection is incomplete we want the user to see a specific message
    const programCategorySelectionIncomplete: boolean =
      useSelector(({ currentSelections: { programId, complete } }) => programId && !complete);

    const missingCategoriesInProgramSelection: ProgramCategories =
      useSelector(({ currentSelections: { categoriesMeta = {}, programId, complete } }) => {
          const selectedProgram = programId && programCollection.get(programId);
          if (selectedProgram && selectedProgram.categoryCombination && !complete) {
              const programCategories = Array.from(selectedProgram.categoryCombination.categories.values())
                  .map(({ id, name }) => ({ id, name }));

              return programCategories.filter(({ id }) =>
                  !(Object.keys(categoriesMeta)
                      .some((programCategoryId => programCategoryId === id))
                  ),
              );
          }
          return [];
      });

    const orgUnitSelectionIncomplete: boolean =
      useSelector(({ currentSelections: { orgUnitId, complete } }) => !orgUnitId && !complete);

    const newPageStatus: $Keys<newPageStatuses> =
        useSelector(({ newPage }) => newPage.newPageStatus);

    const { id: orgUnitId } = useCurrentOrgUnitInfo();
    const { id: programId } = useCurrentProgramInfo();
    const handleMainPageNavigation = () => {
        history.push(`/${urlArguments({ orgUnitId, programId })}`);
    };

    const writeAccess = useUserWriteAccess(currentScopeId);
    return (
        <NewPageComponent
            showMessageToSelectOrgUnitOnNewPage={dispatchShowMessageToSelectOrgUnitOnNewPage}
            showMessageToSelectProgramCategoryOnNewPage={dispatchShowMessageToSelectProgramCategoryOnNewPage}
            showDefaultViewOnNewPage={dispatchShowDefaultViewOnNewPage}
            handleMainPageNavigation={handleMainPageNavigation}
            currentScopeId={currentScopeId}
            orgUnitSelectionIncomplete={orgUnitSelectionIncomplete}
            programCategorySelectionIncomplete={programCategorySelectionIncomplete}
            missingCategoriesInProgramSelection={missingCategoriesInProgramSelection}
            writeAccess={writeAccess}
            newPageStatus={newPageStatus}
            error={error}
            ready={ready}
        />);
};
