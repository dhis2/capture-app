// @flow
import React from 'react';

import {
    ScopeSelector,
    useSetProgramId,
    useSetOrgUnitId,
    useResetProgramId,
    useResetOrgUnitId,
    useReset,
} from '../../ScopeSelector';
import { TopBarActions } from '../../TopBarActions';

type TopBarProps = {
    programId?: string,
    orgUnitId?: string,
};

export const TopBar = ({ programId, orgUnitId }: TopBarProps) => {
    const { setProgramId } = useSetProgramId();
    const { setOrgUnitId } = useSetOrgUnitId();
    const { resetProgramId } = useResetProgramId();
    const { resetOrgUnitId } = useResetOrgUnitId();
    const { reset } = useReset();

    return (
        <ScopeSelector
            selectedProgramId={programId}
            selectedOrgUnitId={orgUnitId}
            onSetProgramId={id => setProgramId(id)}
            onSetOrgUnit={id => setOrgUnitId(id)}
            onResetProgramId={() => resetProgramId()}
            onResetOrgUnitId={() => resetOrgUnitId()}
            onStartAgain={() => reset()}
        >
            <TopBarActions selectedProgramId={programId} selectedOrgUnitId={orgUnitId} />
        </ScopeSelector>
    );
};
