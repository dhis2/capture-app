// @flow
import { colors } from '@dhis2/ui';
import React from 'react';
import { Widget } from '../../Widget';
import { WidgetErrorAndWarningContent } from '../content/WidgetErrorAndWarningContent';
import { widgetTypes } from '../content/WidgetTypes';
import type { Props } from './WidgetWarning.types';
import { WidgetWarningHeader } from './WidgetWarningHeader';

export const WidgetWarning = ({ warning }: Props) => {
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
