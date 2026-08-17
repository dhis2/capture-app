import React from 'react';
import { useTermLabel } from '../../../metaData';
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
    enrollmentsAsOptions: Array<Record<string, unknown>>,
};

export const TopBar = ({
    programId,
    orgUnitId,
    enrollmentId,
    trackedEntityName,
    teiDisplayName,
    enrollmentsAsOptions,
}: TopBarProps) => {
    const enrollmentLabel = useTermLabel('enrollment', { programId });
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
            onResetProgramId={() => resetProgramIdAndEnrollmentContext('', {})}
            onResetOrgUnitId={() => resetOrgUnitId()}
            onStartAgain={() => reset()}
        >
            {trackedEntityName ? (
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
            ) : <></>}
            {enrollmentsAsOptions?.length > 0 ? (
                <SingleLockedSelect
                    ready
                    onClear={() => resetEnrollmentId()}
                    onSelect={id => setEnrollmentId({ enrollmentId: id })}
                    options={enrollmentsAsOptions}
                    selectedValue={enrollmentId}
                    title={enrollmentLabel}
                />
            ) : <></>}
            <TopBarActions selectedProgramId={programId} selectedOrgUnitId={orgUnitId} />
        </ScopeSelector>
    );
};
