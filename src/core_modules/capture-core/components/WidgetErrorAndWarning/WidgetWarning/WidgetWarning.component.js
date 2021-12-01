// @flow
import React from 'react';
import { colors } from '@dhis2/ui';
import { widgetTypes } from '../content/WidgetTypes';
import { WidgetErrorAndWarningContent } from '../content/WidgetErrorAndWarningContent';
import { Widget } from '../../Widget';
import { WidgetWarningHeader } from './WidgetWarningHeader';
import type { Props } from './WidgetWarning.types';

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
