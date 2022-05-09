// @flow
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
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

type TopBarProps = {
    isUserInteractionInProgress: boolean,
    programId?: string,
    orgUnitId?: string,
    selectedCategories?: any,
};

export const TopBar = ({ programId, orgUnitId, selectedCategories, isUserInteractionInProgress }: TopBarProps) => {
    const dispatch = useDispatch();
    const { setProgramId } = useSetProgramId();
    const { setOrgUnitId } = useSetOrgUnitId();
    const { resetProgramIdAndViewEventId } = useResetProgramId();
    const { resetOrgUnitIdAndViewEventId } = useResetOrgUnitId();
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
            onResetProgramId={() => resetProgramIdAndViewEventId('/')}
            onResetOrgUnitId={() => resetOrgUnitIdAndViewEventId('/')}
            onSetCategoryOption={dispatchOnSetCategoryOption}
            onResetAllCategoryOptions={dispatchOnResetAllCategoryOptions}
            onResetCategoryOption={dispatchOnResetCategoryOption}
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
