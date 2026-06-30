import React, { useState, useCallback } from 'react';
import i18n from '@dhis2/d2-i18n';
import { spacersNum } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { Widget } from '../Widget';
import { ReadOnlyBadge } from '../ReadOnlyBadge';
import { Stages } from './Stages';
import { useEnrollmentAccessContext } from '../Pages/common/EnrollmentOverviewDomain/EnrollmentAccessContext';
import { useStageLabel } from '../../metaData';
import type { Props } from './stagesAndEvents.types';

const styles = {
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: `${spacersNum.dp8}px`,
        flex: 1,
    },
    badge: {
        marginInlineStart: 'auto',
    },
};

const WidgetStagesAndEventsPlain = ({
    classes,
    className,
    stages,
    events,
    programId,
    ...passOnProps
}: Props & WithStyles<typeof styles>) => {
    const [open, setOpenStatus] = useState(true);
    const {
        anyStageWriteAccess,
        anyStageReadAccess,
        multipleStages,
        showWidgetBadge,
    } = useEnrollmentAccessContext();
    const stagesLabel = useStageLabel('programStage', { plural: true, programId }) ?? i18n.t('Stages');
    const eventsLabel = useStageLabel('event', { plural: true, programId }) ?? i18n.t('Events');

    return (
        <div
            data-test="stages-and-events-widget"
            className={className}
        >
            <Widget
                header={
                    <div className={classes.header}>
                        <span>{i18n.t('{{stages}} and {{events}}', {
                            stages: stagesLabel,
                            events: eventsLabel,
                            interpolation: { escapeValue: false },
                        })}</span>
                        {showWidgetBadge && (
                            <div className={classes.badge}>
                                <ReadOnlyBadge
                                    programStageWriteAccess={!anyStageReadAccess || anyStageWriteAccess}
                                    multipleStages={multipleStages}
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
                    {...passOnProps}
                />
            </Widget>
        </div>
    );
};

export const WidgetStagesAndEvents = withStyles(styles)(WidgetStagesAndEventsPlain);
