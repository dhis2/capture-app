// @flow
import React, { useState, useCallback } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Widget } from '../Widget';
import type { Props } from './enrollment.types';

export const WidgetEnrollment = ({ className }: Props) => {
    const [open, setOpenStatus] = useState(true);

    return (
        <div
            data-test="enrollment-widget"
            className={className}
        >
            <Widget
                header={i18n.t('Enrollment')}
                onOpen={useCallback(() => setOpenStatus(true), [setOpenStatus])}
                onClose={useCallback(() => setOpenStatus(false), [setOpenStatus])}
                open={open}
            >
                [placeholder content enrollment]
            </Widget>
        </div>
    );
};
