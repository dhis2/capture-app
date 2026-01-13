import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { dataEntryKeys } from 'capture-core/constants';
import type { ProgramStage } from '../../../metaData';
import { pageStatuses } from './EnrollmentEditEventPage.constants';
import {
    ScopeSelector,
    useSetOrgUnitId,
    useResetProgramId,
    useResetOrgUnitId,
    useResetTeiId,
    useResetEnrollmentId,
    useResetStageId,
    useResetEventId,
    useReset,
    SingleLockedSelect,
} from '../../ScopeSelector';
import { TopBarActions } from '../../TopBarActions';

type Props = {
    programStage?: ProgramStage | null;
    enrollmentId: string;
    programId?: string | null;
    mode: string;
    orgUnitId: string;
    trackedEntityName: string;
    teiDisplayName: string;
    eventDate?: string;
    enrollmentsAsOptions: Array<Record<string, unknown>>;
    pageStatus: string;
    teiId: string;
    isUserInteractionInProgress: boolean;
};

export const TopBar = ({
    mode,
    programStage,
    enrollmentId,
    programId,
    enrollmentsAsOptions,
    trackedEntityName,
    teiDisplayName,
    orgUnitId,
    teiId,
    eventDate,
    pageStatus,
    isUserInteractionInProgress,
}: Props) => {
    const { setOrgUnitId } = useSetOrgUnitId();

    const { resetProgramIdAndEnrollmentContext } = useResetProgramId();
    const { resetOrgUnitId } = useResetOrgUnitId();
    const { resetEnrollmentId } = useResetEnrollmentId();
    const { resetTeiId } = useResetTeiId();
    const { resetStageId } = useResetStageId();
    const { resetEventId } = useResetEventId();
    const { reset } = useReset();

    return (
        <ScopeSelector
            selectedProgramId={programId}
            selectedOrgUnitId={orgUnitId}
            onSetOrgUnit={id => setOrgUnitId(id)}
            onResetProgramId={() => resetProgramIdAndEnrollmentContext('enrollment', { teiId })}
            onResetOrgUnitId={() => resetOrgUnitId()}
            isUserInteractionInProgress={isUserInteractionInProgress}
            onStartAgain={() => reset()}
            isReadOnlyOrgUnit
            orgUnitTooltip={mode === dataEntryKeys.EDIT}
        >
            <SingleLockedSelect
                displayOnly
                ready={pageStatus !== pageStatuses.MISSING_DATA}
                onClear={() => resetTeiId('/', { programId: programId ?? undefined })}
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
            <SingleLockedSelect
                ready={pageStatus !== pageStatuses.MISSING_DATA}
                onClear={() => resetEnrollmentId('enrollment', { programId: programId ?? undefined, teiId })}
                options={enrollmentsAsOptions}
                selectedValue={enrollmentId}
                title={i18n.t('Enrollment')}
                isUserInteractionInProgress={isUserInteractionInProgress}
            />
            <SingleLockedSelect
                displayOnly
                ready={pageStatus !== pageStatuses.MISSING_DATA}
                onClear={() => resetStageId('enrollment', { enrollmentId })}
                options={[
                    {
                        label: programStage?.name ?? '',
                        value: 'alwaysPreselected',
                        icon: programStage?.icon,
                    },
                ]}
                selectedValue="alwaysPreselected"
                title={i18n.t('Stage')}
                isUserInteractionInProgress={isUserInteractionInProgress}
            />
            {programStage && (
                <SingleLockedSelect
                    displayOnly
                    ready={pageStatus !== pageStatuses.MISSING_DATA}
                    onClear={() => resetEventId('enrollment', { enrollmentId })}
                    options={[
                        {
                            label: eventDate ?? '',
                            value: 'alwaysPreselected',
                        },
                    ]}
                    selectedValue="alwaysPreselected"
                    title={programStage.stageForm.getLabel('occurredAt')}
                    isUserInteractionInProgress={isUserInteractionInProgress}
                />
            )}
            <TopBarActions
                selectedProgramId={programId}
                selectedOrgUnitId={orgUnitId}
                isUserInteractionInProgress={isUserInteractionInProgress}
            />
        </ScopeSelector>
    );
};
