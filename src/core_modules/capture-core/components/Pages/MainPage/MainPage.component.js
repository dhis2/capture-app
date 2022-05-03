// @flow
import React, { type ComponentType, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { WorkingListsType } from './WorkingListsType';
import type { Props } from './mainPage.types';
import { MainPageStatuses } from './MainPage.constants';
import { WithoutOrgUnitSelectedMessage } from './WithoutOrgUnitSelectedMessage/WithoutOrgUnitSelectedMessage';
import { WithoutCategorySelectedMessage } from './WithoutCategorySelectedMessage/WithoutCategorySelectedMessage';
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

const getStyles = () => ({
    listContainer: {
        padding: 24,
    },
});

const MainPagePlain = ({
    MainPageStatus,
    setShowAccessible,
    programId,
    selectedCategories,
    classes,
    ...passOnProps
}: Props) => {
    const dispatch = useDispatch();
    const { setProgramId } = useSetProgramId();
    const { setOrgUnitId } = useSetOrgUnitId();
    const { resetProgramId } = useResetProgramId();
    const { resetOrgUnitId } = useResetOrgUnitId();
    const { orgUnitId } = passOnProps;
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
        <>
            <ScopeSelector
                selectedProgramId={programId}
                selectedOrgUnitId={orgUnitId}
                selectedCategories={selectedCategories}
                onSetProgramId={id => setProgramId(id)}
                onSetOrgUnit={id => setOrgUnitId(id)}
                onResetProgramId={() => resetProgramId()}
                onResetOrgUnitId={() => resetOrgUnitId()}
                onSetCategoryOption={dispatchOnSetCategoryOption}
                onResetAllCategoryOptions={dispatchOnResetAllCategoryOptions}
                onResetCategoryOption={dispatchOnResetCategoryOption}
            >
                <Grid item xs={12} sm={6} md={6} lg={2}>
                    <TopBarActions selectedProgramId={programId} selectedOrgUnitId={orgUnitId} />
                </Grid>
            </ScopeSelector>
            {MainPageStatus === MainPageStatuses.WITHOUT_ORG_UNIT_SELECTED && (
                <WithoutOrgUnitSelectedMessage programId={programId} setShowAccessible={setShowAccessible} />
            )}
            {MainPageStatus === MainPageStatuses.WITHOUT_PROGRAM_CATEGORY_SELECTED && (
                <WithoutCategorySelectedMessage programId={programId} />
            )}
            {MainPageStatus === MainPageStatuses.SHOW_WORKING_LIST && (
                <div className={classes.listContainer} data-test={'main-page-working-list'}>
                    <WorkingListsType programId={programId} {...passOnProps} />
                </div>
            )}
        </>
    );
};

export const MainPageComponent: ComponentType<$Diff<Props, CssClasses>> = withStyles(getStyles)(MainPagePlain);
