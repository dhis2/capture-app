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
    SingleLockedSelect,
} from '../../ScopeSelector';
import { TopBarActions } from '../../TopBarActions';

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
    const { setProgramIdAndResetEnrollmentContext } = useSetProgramId();
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
            onSetProgramId={id => setProgramIdAndResetEnrollmentContext(id)}
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
            {enrollmentsAsOptions?.length > 0 ? (
                <SingleLockedSelect
                    ready
                    onClear={() => resetEnrollmentId()}
                    onSelect={id => setEnrollmentId({ enrollmentId: id })}
                    options={enrollmentsAsOptions}
                    selectedValue={enrollmentId}
                    title={i18n.t('Enrollment')}
                />
            ) : <></>}
            <TopBarActions selectedProgramId={programId} selectedOrgUnitId={orgUnitId} />
        </ScopeSelector>
    );
};
