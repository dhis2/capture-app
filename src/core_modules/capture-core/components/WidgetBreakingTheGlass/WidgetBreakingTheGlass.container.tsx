import React, { useCallback } from 'react';
import { useDataMutation } from '@dhis2/app-runtime';
import type { Props } from './WidgetBreakingTheGlass.types';
import { WidgetBreakingTheGlassComponent } from './WidgetBreakingTheGlass.component';

const glassBreakRequest = {
    resource: 'tracker/ownership/override',
    type: 'create',
    params: ({ teiId, teiParamKey, program, reason }: any) => ({
        [teiParamKey]: teiId,
        program,
        reason,
    }),
} as any;

export const WidgetBreakingTheGlass = ({
    teiId,
    programId,
    onBreakingTheGlass,
    onCancel,
}: Props) => {
    const [postGlassBreakRequest] = useDataMutation(glassBreakRequest);
    const teiParamKey = 'trackedEntity';

    const performGlassBreak = useCallback(async (reason?: string) => {
        if (!reason) {
            return;
        }
        await postGlassBreakRequest({
            teiId,
            teiParamKey,
            program: programId,
            reason,
        });
        onBreakingTheGlass();
    }, [onBreakingTheGlass, postGlassBreakRequest, teiId, programId, teiParamKey]);

    return (
        <WidgetBreakingTheGlassComponent
            onBreakingTheGlass={performGlassBreak}
            onCancel={onCancel}
        />
    );
};
