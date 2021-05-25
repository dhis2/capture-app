// @flow
import React, { useCallback, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Widget } from '../Widget';
import type { Props } from './WidgetFeedback.types';

export const WidgetFeedback = ({ className }: Props) => {
    const [openStatus, setOpenStatus] = useState(false);
    return (
        <div
            className={className}
        >
            <Widget
                header={i18n.t('Feedback')}
                onOpen={useCallback(() => setOpenStatus(true), [setOpenStatus])}
                onClose={useCallback(() => setOpenStatus(false), [setOpenStatus])}
                open={openStatus}
            >
                <p>Feedback Placeholder Text</p>
            </Widget>
        </div>
    );
};
