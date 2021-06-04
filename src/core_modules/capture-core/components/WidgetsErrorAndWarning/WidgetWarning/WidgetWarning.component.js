// @flow
import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Widget } from '../../Widget';
import type { widgetWarningTypes } from './WidgetWarning.types';

export const WidgetWarning = ({ warning }: widgetWarningTypes) => {
    const [openStatus, setOpenStatus] = useState(true);
    const widgetType = 'warning';

    if (!warning?.length) {
        return null;
    }

    return (
        <div
            data-test={'error-widget'}
        >
            <Widget
                header={i18n.t('Warning')}
                open={openStatus}
                onOpen={() => setOpenStatus(true)}
                onClose={() => setOpenStatus(false)}
            >
                <p>This component will use the content builder in the WidgetError-PR</p>
            </Widget>
        </div>
    );
};
