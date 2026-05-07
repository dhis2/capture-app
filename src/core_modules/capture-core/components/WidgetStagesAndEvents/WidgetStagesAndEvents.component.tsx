import React, { useState, useCallback, useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Widget } from '../Widget';
import { ReadOnlyBadge } from '../ReadOnlyBadge';
import { Stages } from './Stages';
import { useProgram } from '../WidgetEnrollment/hooks/useProgram';
import type { Props } from './stagesAndEvents.types';

export const WidgetStagesAndEvents = ({
    className,
    stages,
    events,
    programId,
    hideReadOnlyBadge,
    ...passOnProps
}: Props) => {
    const [open, setOpenStatus] = useState(true);
    const { program } = useProgram(programId);
    const stageWriteAccessById = useMemo(() => {
        const map: Record<string, boolean> = {};
        (program?.programStages ?? []).forEach((stage: any) => {
            map[stage.id] = Boolean(stage?.access?.data?.write);
        });
        return map;
    }, [program]);
    const stageReadAccessById = useMemo(() => {
        const map: Record<string, boolean> = {};
        (program?.programStages ?? []).forEach((stage: any) => {
            map[stage.id] = Boolean(stage?.access?.data?.read);
        });
        return map;
    }, [program]);
    const anyStageWriteAccess = Object.values(stageWriteAccessById).some(Boolean);
    const anyStageReadAccess = Object.values(stageReadAccessById).some(Boolean);

    return (
        <div
            data-test="stages-and-events-widget"
            className={className}
        >
            <Widget
                header={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                        <span>{i18n.t('Stages and Events')}</span>
                        {!hideReadOnlyBadge && (
                            <div style={{ marginInlineStart: 'auto' }}>
                                <ReadOnlyBadge
                                    readOnly={anyStageReadAccess && !anyStageWriteAccess}
                                    programStageWriteAccess={anyStageWriteAccess}
                                    multipleStages={Object.keys(stageWriteAccessById).length > 1}
                                />
                            </div>
                        )}
                    </div>
                }
                onOpen={useCallback(() => setOpenStatus(true), [setOpenStatus])}
                onClose={useCallback(() => setOpenStatus(false), [setOpenStatus])}
                open={open}
            >
                <Stages
                    stages={stages}
                    ready={events !== undefined && stages !== undefined}
                    events={events}
                    programId={programId}
                    stageWriteAccessById={stageWriteAccessById}
                    stageReadAccessById={stageReadAccessById}
                    programLoaded={Boolean(program)}
                    hideReadOnlyBadge={hideReadOnlyBadge || !anyStageWriteAccess}
                    {...passOnProps}
                />
            </Widget>
        </div>
    );
};
