// @flow
import React from 'react';
import Grid from '@material-ui/core/Grid';

import {
    ScopeSelector,
    useSetProgramId,
    useSetOrgUnitId,
    useResetProgramId,
    useResetOrgUnitId,
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

    return (
        <ScopeSelector
            selectedProgramId={programId}
            selectedOrgUnitId={orgUnitId}
            onSetProgramId={id => setProgramId(id)}
            onSetOrgUnit={id => setOrgUnitId(id)}
            onResetProgramId={() => resetProgramId()}
            onResetOrgUnitId={() => resetOrgUnitId()}
        >
            <Grid item xs={12} sm={6} md={6} lg={2}>
                <TopBarActions selectedProgramId={programId} selectedOrgUnitId={orgUnitId} />
            </Grid>
        </ScopeSelector>
    );
};
