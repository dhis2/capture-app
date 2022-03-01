// @flow
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Grid } from '@material-ui/core';
import { batchActions } from 'redux-batched-actions';
import { ScopeSelector, useSetProgramId, useSetOrgUnitId, useResetProgramId, useResetOrgUnitId, useResetTeiId } from '../../ScopeSelector';
import { TopBarActions } from '../../TopBarActions';
import { SingleLockedSelect } from '../../ScopeSelector/QuickSelector/SingleLockedSelect.component';
import type { Props } from './topBar.types';
import { cleanUpDataEntry } from './NewPage.actions';
// should move in outside EnrollmentOverviewDomain
import { useTeiDisplayName } from '../common/EnrollmentOverviewDomain/useTeiDisplayName';
import { useProgramInfo } from '../../../hooks/useProgramInfo';

// is this duplicate?
export const NEW_TEI_DATA_ENTRY_ID = 'newPageDataEntryId';
export const NEW_SINGLE_EVENT_DATA_ENTRY_ID = 'singleEvent';
export const NEW_RELATIONSHIP_EVENT_DATA_ENTRY_ID = 'relationship';

export const NewPageTopBar = ({
    programId,
    orgUnitId,
    teiId,
    isUserInteractionInProgress,
    selectedCategories,
    setSelectedCategories,
    teiContext: { trackedEntityName, teiDisplayName },
}) => {
    const dispatch = useDispatch();
    const { setProgramId } = useSetProgramId();
    const { setOrgUnitId } = useSetOrgUnitId();

    const { resetProgramId } = useResetProgramId();
    const { resetOrgUnitId } = useResetOrgUnitId();
    const { resetTeiId } = useResetTeiId();

    return (
        <ScopeSelector
            selectedProgramId={programId}
            selectedOrgUnitId={orgUnitId}
            selectedCategories={selectedCategories}
            onSetProgramId={id => setProgramId(id)}
            onSetOrgUnit={id => setOrgUnitId(id)}
            onSetCategoryOption={(categoryOption, categoryId) => setSelectedCategories({ [categoryId]: categoryOption })}
            onResetAllCategoryOptions={() => setSelectedCategories()}
            onResetCategoryOption={categoryId => {
                const { [categoryId]: remove, ...rest } = selectedCategories;
                setSelectedCategories(rest);
            }}
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
            isUserInteractionInProgress={isUserInteractionInProgress}>
            {teiId && (
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <SingleLockedSelect
                        ready={trackedEntityName && teiDisplayName}
                        onClear={() => {
                            dispatch(
                                batchActions([
                                    cleanUpDataEntry(NEW_TEI_DATA_ENTRY_ID),
                                    cleanUpDataEntry(NEW_SINGLE_EVENT_DATA_ENTRY_ID),
                                    cleanUpDataEntry(NEW_RELATIONSHIP_EVENT_DATA_ENTRY_ID),
                                ]),
                            );
                            // resetTeiId()
                        }}
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
