import React, { useState, useCallback } from 'react';
import i18n from '@dhis2/d2-i18n';
import { spacersNum } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { Widget } from '../Widget';
import { ReadOnlyBadge } from '../ReadOnlyBadge';
import { Stages } from './Stages';
import { useEnrollmentAccessContext } from '../Pages/common/EnrollmentOverviewDomain/EnrollmentAccessContext';
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
        hideWidgetBadge,
        anyStageWriteAccess,
        anyStageReadAccess,
        multipleStages,
    } = useEnrollmentAccessContext();

    return (
        <div
            data-test="stages-and-events-widget"
            className={className}
        >
            <Widget
                header={
                    <div className={classes.header}>
                        <span>{i18n.t('Stages and Events')}</span>
                        {!hideWidgetBadge && (
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
