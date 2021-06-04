// @flow
import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Widget } from '../../Widget';
import type { Props } from './WidgetError.types';
import { WidgetErrorAndWarningContent } from '../content/WidgetErrorAndWarningContent';


export const WidgetError = ({ error, classes }: Props) => {
    const [openStatus, setOpenStatus] = useState(true);
    const widgetType = 'error';

    if (!error?.length) {
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
                <WidgetErrorAndWarningContent
                    widgetData={error}
                    type={widgetType}
                />
            </Widget>
        </div>
    );
};
