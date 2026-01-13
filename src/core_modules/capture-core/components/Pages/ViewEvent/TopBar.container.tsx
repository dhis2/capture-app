import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
    ScopeSelector,
    useResetViewEventId,
    useReset,
    useSetOrgUnitId,
    useResetOrgUnitId,
} from '../../ScopeSelector';
import {
    setCategoryOption,
    resetCategoryOption,
    resetAllCategoryOptions,
} from './ViewEventPage.actions';
import { TopBarActions } from '../../TopBarActions';

type TopBarProps = {
    isUserInteractionInProgress: boolean,
    programId?: string,
    orgUnitId?: string,
    selectedCategories?: any,
    editEventMode?: boolean,
    formIsOpen: boolean,
};

export const TopBar = ({
    programId,
    orgUnitId,
    selectedCategories,
    isUserInteractionInProgress,
    editEventMode,
    formIsOpen,
}: TopBarProps) => {
    const dispatch = useDispatch();
    const { resetViewEventId } = useResetViewEventId();
    const { setOrgUnitId } = useSetOrgUnitId();
    const { resetOrgUnitId } = useResetOrgUnitId();
    const { reset } = useReset();
    const dispatchOnSetCategoryOption = useCallback(
        (categoryOption: any, categoryId: string) => {
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
            onResetProgramId={() => resetViewEventId('/', { orgUnitId })}
            onSetOrgUnit={id => setOrgUnitId(id)}
            onResetOrgUnitId={() => resetOrgUnitId()}
            onSetCategoryOption={dispatchOnSetCategoryOption}
            onResetAllCategoryOptions={dispatchOnResetAllCategoryOptions}
            onResetCategoryOption={dispatchOnResetCategoryOption}
            isUserInteractionInProgress={isUserInteractionInProgress}
            formIsOpen={formIsOpen}
            onStartAgain={() => reset()}
            isReadOnlyOrgUnit
            orgUnitTooltip={editEventMode}
        >
            <TopBarActions
                selectedProgramId={programId}
                selectedOrgUnitId={orgUnitId}
                isUserInteractionInProgress={isUserInteractionInProgress}
            />
        </ScopeSelector>
    );
};
