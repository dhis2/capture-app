// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { ScopeSelector, SingleLockedSelect, useReset } from '../../../ScopeSelector';
import { TopBarActions } from '../../../TopBarActions';
import type { Props } from './topBar.types';

export const EnrollmentAddEventTopBar = ({
    programId,
    orgUnitId,
    enrollmentId,
    teiDisplayName,
    trackedEntityName,
    stageName,
    stageIcon,
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
}: Props) => {
    const { reset } = useReset();
    return (
        <ScopeSelector
            selectedProgramId={programId}
            selectedOrgUnitId={orgUnitId}
            onSetOrgUnit={id => onSetOrgUnitId(id)}
            onResetProgramId={() => onResetProgramId()}
            onResetOrgUnitId={() => onResetOrgUnitId()}
            isUserInteractionInProgress={userInteractionInProgress}
            onStartAgain={() => reset()}
        >
            <SingleLockedSelect
                displayOnly
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
            <SingleLockedSelect
                ready={Boolean(enrollmentsAsOptions)}
                onClear={() => onResetEnrollmentId()}
                options={enrollmentsAsOptions || []}
                selectedValue={enrollmentId}
                title={i18n.t('Enrollment')}
                isUserInteractionInProgress={userInteractionInProgress}
            />
            {stageName && (
                <>
                    <SingleLockedSelect
                        displayOnly
                        ready
                        onClear={() => onResetStageId()}
                        options={[
                            {
                                label: stageName,
                                value: 'alwaysPreselected',
                                icon: stageIcon,
                            },
                        ]}
                        selectedValue="alwaysPreselected"
                        title={i18n.t('Stage')}
                        isUserInteractionInProgress={userInteractionInProgress}
                    />

                    <SingleLockedSelect
                        displayOnly
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
                </>
            )}

            <TopBarActions
                selectedProgramId={programId}
                selectedOrgUnitId={orgUnitId}
                isUserInteractionInProgress={userInteractionInProgress}
            />
        </ScopeSelector>
    );
};
