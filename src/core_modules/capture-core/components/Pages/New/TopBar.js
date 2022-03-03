// @flow
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import {
    ScopeSelector,
    useSetProgramId,
    useSetOrgUnitId,
    useResetProgramId,
    useResetOrgUnitId,
    setCategoryOptionFromScopeSelector,
    resetCategoryOptionFromScopeSelector,
    resetAllCategoryOptionsFromScopeSelector,
} from '../../ScopeSelector';
import { TopBarActions } from '../../TopBarActions';
import { cleanUpDataEntry } from './NewPage.actions';
import {
    NEW_TEI_DATA_ENTRY_ID,
    NEW_RELATIONSHIP_EVENT_DATA_ENTRY_ID,
    NEW_SINGLE_EVENT_DATA_ENTRY_ID,
} from './NewPage.constants';

type TopBarProps = {
    programId?: string,
    orgUnitId?: string,
    isUserInteractionInProgress: boolean,
};

export const NewPageTopBar = ({ programId, orgUnitId, isUserInteractionInProgress }: TopBarProps) => {
    const dispatch = useDispatch();
    const { setProgramId } = useSetProgramId();
    const { setOrgUnitId } = useSetOrgUnitId();

    const { resetProgramId } = useResetProgramId();
    const { resetOrgUnitId } = useResetOrgUnitId();

    const { selectedCategories } = useSelector(({ currentSelections }) => ({
        selectedCategories: currentSelections.categoriesMeta,
    }));

    const dispatchOnSetCategoryOption = useCallback(
        (categoryOption: Object, categoryId: string) => {
            dispatch(setCategoryOptionFromScopeSelector(categoryId, categoryOption));
        },
        [dispatch],
    );
    const dispatchOnResetCategoryOption = useCallback(
        (categoryId: string) => {
            dispatch(resetCategoryOptionFromScopeSelector(categoryId));
        },
        [dispatch],
    );
    const dispatchOnResetAllCategoryOptions = useCallback(() => {
        dispatch(resetAllCategoryOptionsFromScopeSelector());
    }, [dispatch]);

    return (
        <ScopeSelector
            selectedProgramId={programId}
            selectedOrgUnitId={orgUnitId}
            selectedCategories={selectedCategories}
            onSetProgramId={id => setProgramId(id)}
            onSetOrgUnit={id => setOrgUnitId(id)}
            onSetCategoryOption={dispatchOnSetCategoryOption}
            onResetAllCategoryOptions={dispatchOnResetAllCategoryOptions}
            onResetCategoryOption={dispatchOnResetCategoryOption}
            onResetOrgUnitId={() => resetOrgUnitId()}
            onResetProgramId={() => resetProgramId()}
            customActionsOnProgramIdReset={[
                cleanUpDataEntry(NEW_TEI_DATA_ENTRY_ID),
                cleanUpDataEntry(NEW_SINGLE_EVENT_DATA_ENTRY_ID),
                cleanUpDataEntry(NEW_RELATIONSHIP_EVENT_DATA_ENTRY_ID),
            ]}
            customActionsOnOrgUnitIdReset={[
                cleanUpDataEntry(NEW_TEI_DATA_ENTRY_ID),
                cleanUpDataEntry(NEW_SINGLE_EVENT_DATA_ENTRY_ID),
                cleanUpDataEntry(NEW_RELATIONSHIP_EVENT_DATA_ENTRY_ID),
            ]}
            isUserInteractionInProgress={isUserInteractionInProgress}
        >
            <Grid item xs={12} sm={6} md={6} lg={2}>
                <TopBarActions
                    selectedProgramId={programId}
                    selectedOrgUnitId={orgUnitId}
                    isUserInteractionInProgress={isUserInteractionInProgress}
                />
            </Grid>
        </ScopeSelector>
    );
};
