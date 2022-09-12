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
    useResetTeiId,
    SingleLockedSelect,
} from '../../ScopeSelector';
import {
    setCategoryOption,
    resetCategoryOption,
    resetAllCategoryOptions,
} from './NewPage.actions';
import { TopBarActions } from '../../TopBarActions';

type TopBarProps = {
    programId?: string,
    orgUnitId?: string,
    teiId?: string,
    trackedEntityName?: string,
    teiDisplayName?: string,
    isUserInteractionInProgress: boolean,
};

export const TopBar = ({
    programId,
    orgUnitId,
    teiId,
    isUserInteractionInProgress,
    trackedEntityName = '',
    teiDisplayName = '',
}: TopBarProps) => {
    const dispatch = useDispatch();
    const { setProgramId } = useSetProgramId();
    const { setOrgUnitId } = useSetOrgUnitId();

    const { resetProgramIdAndTeiId } = useResetProgramId();
    const { resetOrgUnitId } = useResetOrgUnitId();
    const { resetTeiId } = useResetTeiId();

    const { selectedCategories } = useSelector(({ currentSelections }) => ({
        selectedCategories: currentSelections.categoriesMeta,
    }));

    const dispatchOnSetCategoryOption = useCallback(
        (categoryOption: Object, categoryId: string) => {
            dispatch(setCategoryOption(categoryId, categoryOption));
        },
        [dispatch],
    );
    const dispatchOnResetCategoryOption = useCallback(
        (categoryId: string) => {
            dispatch(resetCategoryOption(categoryId));
        },
        [dispatch],
    );
    const dispatchOnResetAllCategoryOptions = useCallback(() => {
        dispatch(resetAllCategoryOptions());
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
            onResetProgramId={() => resetProgramIdAndTeiId()}
            onResetOrgUnitId={() => resetOrgUnitId()}
            isUserInteractionInProgress={isUserInteractionInProgress}
        >
            {teiId && (
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <SingleLockedSelect
                        ready={!!(trackedEntityName && teiDisplayName)}
                        onClear={() => resetTeiId()}
                        options={[
                            {
                                label: teiDisplayName,
                                value: 'alwaysPreselected',
                            },
                        ]}
                        selectedValue="alwaysPreselected"
                        title={trackedEntityName}
                        isUserInteractionInProgress={isUserInteractionInProgress}
                    />
                </Grid>
            )}
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
