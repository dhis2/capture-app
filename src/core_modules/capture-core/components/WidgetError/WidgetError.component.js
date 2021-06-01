// @flow
import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Widget } from '../Widget';
import type { Props } from './WidgetError.types';
import { WidgetErrorContent } from './WidgetErrorContent/WidgetErrorContent';


export const WidgetError = ({ showError, classes }: Props) => {
    const [openStatus, setOpenStatus] = useState(true);

    if (!showError || showError.length === 0) {
        return null;
    }

    return (
        <div
            className={classes}
            data-test={'error-widget'}
        >
            <Widget
                header={i18n.t('Error')}
                open={openStatus}
                onOpen={() => setOpenStatus(true)}
                onClose={() => setOpenStatus(false)}
            >
                <WidgetErrorContent widgetData={showError} />
            </Widget>
        </div>
    );
};
