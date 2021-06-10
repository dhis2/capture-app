// @flow
import React from 'react';
import { colors } from '@dhis2/ui';
import { Widget } from '../../Widget';
import type { widgetWarningTypes } from './WidgetWarning.types';
import { WidgetErrorAndWarningContent } from '../content/WidgetErrorAndWarningContent';
import { WidgetWarningHeader } from './WidgetWarningHeader';

export const WidgetWarning = ({ warning }: widgetWarningTypes) => {
    const widgetType = 'warning';

    if (!warning?.length) {
        return null;
    }

    return (
        <div
            data-test={'error-widget'}
        >
            <Widget
                header={<WidgetWarningHeader />}
                noncollapsible
                color={colors.yellow050}
            >
                <WidgetErrorAndWarningContent
                    widgetData={warning}
                    type={widgetType}
                />
            </Widget>
        </div>
    );
};
