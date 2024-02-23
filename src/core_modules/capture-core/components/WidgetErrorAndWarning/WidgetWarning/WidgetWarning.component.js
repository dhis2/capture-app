// @flow
import React from 'react';
import { colors } from '@dhis2/ui';
import { Widget } from '../../Widget';
import type { PlainProps } from './WidgetWarning.types';
import { WidgetErrorAndWarningContent } from '../content/WidgetErrorAndWarningContent';
import { WidgetWarningHeader } from './WidgetWarningHeader';
import { widgetTypes } from '../content/WidgetTypes';

export const WidgetWarning = ({ warning }: PlainProps) => {
    const widgetType = widgetTypes.WARNING;

    if (!warning?.length) {
        return null;
    }

    return (
        <div
            data-test="error-widget"
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
