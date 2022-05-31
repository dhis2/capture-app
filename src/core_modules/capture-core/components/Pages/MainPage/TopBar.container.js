// @flow
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Grid } from '@material-ui/core';
import {
    ScopeSelector,
    useSetProgramId,
    useSetOrgUnitId,
    useResetProgramId,
    useResetOrgUnitId,
    setCategoryOptionFromScopeSelector,
    setOrgUnitFromScopeSelector,
    resetCategoryOptionFromScopeSelector,
    resetAllCategoryOptionsFromScopeSelector,
} from '../../ScopeSelector';
import { TopBarActions } from '../../TopBarActions';

type TopBarProps = {
    programId?: string,
    orgUnitId?: string,
    selectedCategories?: any,
};

export const TopBar = ({ programId, orgUnitId, selectedCategories }: TopBarProps) => {
    const dispatch = useDispatch();
    const { setProgramId } = useSetProgramId();
    const { setOrgUnitId } = useSetOrgUnitId();
    const { resetProgramIdAndSelectedTemplateId } = useResetProgramId();
    const { resetOrgUnitId } = useResetOrgUnitId();
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

    const dispatchOnSetOrgUnit = useCallback(
        (id: string) => {
            setOrgUnitId(id);
            dispatch(setOrgUnitFromScopeSelector(id));
        },
        [dispatch, setOrgUnitId],
    );

    return (
        <ScopeSelector
            selectedProgramId={programId}
            selectedOrgUnitId={orgUnitId}
            selectedCategories={selectedCategories}
            onSetProgramId={id => setProgramId(id)}
            onSetOrgUnit={id => dispatchOnSetOrgUnit(id)}
            onResetProgramId={() => resetProgramIdAndSelectedTemplateId()}
            onResetOrgUnitId={() => resetOrgUnitId()}
            onSetCategoryOption={dispatchOnSetCategoryOption}
            onResetAllCategoryOptions={dispatchOnResetAllCategoryOptions}
            onResetCategoryOption={dispatchOnResetCategoryOption}
        >
            <Grid item xs={12} sm={6} md={6} lg={2}>
                <TopBarActions selectedProgramId={programId} selectedOrgUnitId={orgUnitId} />
            </Grid>
        </ScopeSelector>
    );
};
