// @flow
import React from 'react';
import { Grid } from '@material-ui/core';
import i18n from '@dhis2/d2-i18n';
import { TopBarActions } from '../../../TopBarActions';
import { ScopeSelector, SingleLockedSelect } from '../../../ScopeSelector';
import type { Props } from './topBar.types';

export const EnrollmentAddEventTopBar = ({
    programId,
    orgUnitId,
    enrollmentId,
    teiDisplayName,
    trackedEntityName,
    stageName,
    eventDateLabel,
    onSetOrgUnitId,
    onResetOrgUnitId,
    onResetProgramId,
    onResetTeiId,
    onResetEnrollmentId,
    onResetStageId,
    onResetEventId,
    userInteractionInProgress,
    enrollmentsAsOptions,

}: Props) => (
    <ScopeSelector
        selectedProgramId={programId}
        selectedOrgUnitId={orgUnitId}
        onSetOrgUnit={id => onSetOrgUnitId(id)}
        onResetProgramId={() => onResetProgramId()}
        onResetOrgUnitId={() => onResetOrgUnitId()}
        isUserInteractionInProgress={userInteractionInProgress}
    >
        <Grid item xs={12} sm={6} md={4} lg={2}>
            <SingleLockedSelect
                ready={Boolean(teiDisplayName && trackedEntityName)}
                onClear={() => onResetTeiId()}
                options={[
                    {
                        label: teiDisplayName || '',
                        value: 'alwaysPreselected',
                    },
                ]}
                selectedValue="alwaysPreselected"
                title={trackedEntityName || ''}
                isUserInteractionInProgress={userInteractionInProgress}
            />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
            <SingleLockedSelect
                ready={Boolean(enrollmentsAsOptions)}
                onClear={() => onResetEnrollmentId()}
                options={enrollmentsAsOptions || []}
                selectedValue={enrollmentId}
                title={i18n.t('Enrollment')}
                isUserInteractionInProgress={userInteractionInProgress}
            />
        </Grid>
        {stageName && (
            <>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <SingleLockedSelect
                        ready
                        onClear={() => onResetStageId()}
                        options={[
                            {
                                label: stageName,
                                value: 'alwaysPreselected',
                            },
                        ]}
                        selectedValue="alwaysPreselected"
                        title={i18n.t('stage')}
                        isUserInteractionInProgress={userInteractionInProgress}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={2}>
                    <SingleLockedSelect
                        ready
                        onClear={() => onResetEventId()}
                        options={[
                            {
                                label: '-',
                                value: 'alwaysPreselected',
                            },
                        ]}
                        selectedValue="alwaysPreselected"
                        title={eventDateLabel || ''}
                        isUserInteractionInProgress={userInteractionInProgress}
                    />
                </Grid>
            </>
        )}
        <Grid item xs={12} sm={6} md={6} lg={2}>
            <TopBarActions
                selectedProgramId={programId}
                selectedOrgUnitId={orgUnitId}
                isUserInteractionInProgress={userInteractionInProgress}
            />
        </Grid>
    </ScopeSelector>
);
