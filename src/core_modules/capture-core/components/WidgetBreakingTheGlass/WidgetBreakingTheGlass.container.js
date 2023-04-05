// @flow
import React, { useCallback } from 'react';
import { useDataMutation } from '@dhis2/app-runtime';
import type { Props } from './WidgetBreakingTheGlass.types';
import { WidgetBreakingTheGlassComponent } from './WidgetBreakingTheGlass.component';

const glassBreakRequest = {
    resource: 'tracker/ownership/override',
    type: 'create',
    params: ({ tei, program, reason }) => ({
        trackedEntityInstance: tei,
        program,
        reason,
    }),
};

export const WidgetBreakingTheGlass = ({
    teiId,
    programId,
    onBreakingTheGlass,
    onCancel,
}: Props) => {
    const [postGlassBreakRequest] = useDataMutation(glassBreakRequest);

    const performGlassBreak = useCallback(async (reason) => {
        await postGlassBreakRequest({
            tei: teiId,
            program: programId,
            reason,
        });
        onBreakingTheGlass();
    }, [onBreakingTheGlass, postGlassBreakRequest, teiId, programId]);

    return (
        <WidgetBreakingTheGlassComponent
            onBreakingTheGlass={performGlassBreak}
            onCancel={onCancel}
        />
    );
};
