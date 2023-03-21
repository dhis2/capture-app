// @flow
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
    ScopeSelector,
    useSetProgramId,
    useSetOrgUnitId,
    useResetProgramId,
    useResetOrgUnitId,
    useReset,
    setOrgUnitFromScopeSelector,
} from '../../ScopeSelector';
import {
    setCategoryOption,
    resetCategoryOption,
    resetAllCategoryOptions,
} from './MainPage.actions';
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
    const { reset } = useReset();

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
            onStartAgain={() => reset()}
        >
            <TopBarActions selectedProgramId={programId} selectedOrgUnitId={orgUnitId} />
        </ScopeSelector>
    );
};
