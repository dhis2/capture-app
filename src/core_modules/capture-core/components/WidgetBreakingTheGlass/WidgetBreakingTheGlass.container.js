// @flow
import React, { useState, useMemo } from 'react';
import { useDataMutation } from '@dhis2/app-runtime';
import type { Props } from './WidgetBreakingTheGlass.types';
import { WidgetBreakingTheGlassComponent } from './WidgetBreakingTheGlass.component';

export const WidgetBreakingTheGlass = ({
    teiId,
    programId,
    onBreakingTheGlass,
}: Props) => {
    const [reason, setReason] = useState('');

    const resource = useMemo(
        () => `tracker/ownership/override?trackedEntityInstance=${teiId}&program=${programId}&reason=${reason}`,
        [teiId, programId, reason],
    );

    const [postGlassBreakRequest] = useDataMutation({
        resource,
        type: 'create',
        data: obj => obj,
    });

    const performGlassBreak = async () => {
        await postGlassBreakRequest({
            tei: teiId,
            program: programId,
            reason,
        });
        onBreakingTheGlass();
    };

    return (
        <WidgetBreakingTheGlassComponent
            reason={reason}
            setReason={setReason}
            onBreakingTheGlass={performGlassBreak}
        />
    );
};
