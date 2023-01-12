// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import {
    ScopeSelector,
    useSetProgramId,
    useSetOrgUnitId,
    useSetEnrollmentId,
    useResetProgramId,
    useResetOrgUnitId,
    useResetTeiId,
    useResetEnrollmentId,
    useReset,
} from '../../ScopeSelector';
import { TopBarActions } from '../../TopBarActions';
import { SingleLockedSelect } from '../../ScopeSelector/QuickSelector/SingleLockedSelect.component';

type TopBarProps = {
    programId: string,
    orgUnitId: string,
    enrollmentId: string,
    trackedEntityName: string,
    teiDisplayName: string,
    enrollmentsAsOptions: Array<Object>,
};

export const TopBar = ({
    programId,
    orgUnitId,
    enrollmentId,
    trackedEntityName,
    teiDisplayName,
    enrollmentsAsOptions,
}: TopBarProps) => {
    const { setProgramId } = useSetProgramId();
    const { setOrgUnitId } = useSetOrgUnitId();
    const { setEnrollmentId } = useSetEnrollmentId();

    const { resetProgramIdAndEnrollmentContext } = useResetProgramId();
    const { resetOrgUnitId } = useResetOrgUnitId();
    const { resetEnrollmentId } = useResetEnrollmentId();
    const { resetTeiId } = useResetTeiId();
    const { reset } = useReset();

    return (
        <ScopeSelector
            selectedProgramId={programId}
            selectedOrgUnitId={orgUnitId}
            onSetProgramId={id => setProgramId(id)}
            onSetOrgUnit={id => setOrgUnitId(id)}
            onResetProgramId={() => resetProgramIdAndEnrollmentContext()}
            onResetOrgUnitId={() => resetOrgUnitId()}
            onStartAgain={() => reset()}
        >
            <SingleLockedSelect
                ready={Boolean(trackedEntityName && teiDisplayName)}
                onClear={() => resetTeiId('/')}
                options={[
                    {
                        label: teiDisplayName,
                        value: 'alwaysPreselected',
                    },
                ]}
                selectedValue="alwaysPreselected"
                title={trackedEntityName}
                displayOnly
            />
            <SingleLockedSelect
                ready
                onClear={() => resetEnrollmentId()}
                onSelect={id => setEnrollmentId({ enrollmentId: id })}
                options={enrollmentsAsOptions}
                selectedValue={enrollmentId}
                title={i18n.t('Enrollment')}
            />
            <TopBarActions selectedProgramId={programId} selectedOrgUnitId={orgUnitId} />
        </ScopeSelector>
    );
};
