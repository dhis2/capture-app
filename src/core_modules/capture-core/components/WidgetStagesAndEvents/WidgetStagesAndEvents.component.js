// @flow
import React, { useState, useCallback } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Widget } from '../Widget';
import { Stages } from './Stages';
import type { Props } from './stagesAndEvents.types';

export const WidgetStagesAndEvents = ({ className, stages, events, ...passOnProps }: Props) => {
    const [open, setOpenStatus] = useState(true);
    return (
        <div
            data-test="stages-and-events-widget"
            className={className}
        >
            <Widget
                header={i18n.t('Stages and Events')}
                onOpen={useCallback(() => setOpenStatus(true), [setOpenStatus])}
                onClose={useCallback(() => setOpenStatus(false), [setOpenStatus])}
                open={open}
            >
                <Stages
                    stages={stages}
                    ready={events !== undefined && stages !== undefined}
                    events={events}
                    {...passOnProps}
                />
            </Widget>
        </div>
    );
};
