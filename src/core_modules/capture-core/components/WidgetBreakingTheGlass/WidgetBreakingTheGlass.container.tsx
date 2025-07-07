import React, { useCallback } from 'react';
import { useDataMutation } from '@dhis2/app-runtime';
import { FEATURES, useFeature } from 'capture-core-utils';
import type { Props } from './WidgetBreakingTheGlass.types';
import { WidgetBreakingTheGlassComponent } from './WidgetBreakingTheGlass.component';

const glassBreakRequest = {
    resource: 'tracker/ownership/override',
    type: 'create',
    data: ({ teiId, teiParamKey, program, reason }: any) => ({
        [teiParamKey]: teiId,
        program,
        reason,
    }),
} as const;

export const WidgetBreakingTheGlass = ({
    teiId,
    programId,
    onBreakingTheGlass,
    onCancel,
}: Props) => {
    const [postGlassBreakRequest] = useDataMutation(glassBreakRequest);
    const teiParamKey = useFeature(FEATURES.newTrackedEntityQueryParam) ? 'trackedEntity' : 'trackedEntityInstance';

    const performGlassBreak = useCallback(async (reason?: string) => {
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
