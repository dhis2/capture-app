import React from 'react';
import { colors } from '@dhis2/ui';
import { Widget } from '../../Widget';
import type { Props } from './WidgetError.types';
import { WidgetErrorAndWarningContent } from '../content/WidgetErrorAndWarningContent';
import { WidgetErrorHeader } from './WidgetErrorHeader';
import { widgetTypes } from '../content/WidgetTypes';


export const WidgetError = ({ error }: Props) => {
    const widgetType = widgetTypes.ERROR;

    if (!error?.length) {
        return null;
    }

    return (
        <div
            data-test="error-widget"
        >
            <Widget
                header={<WidgetErrorHeader />}
                noncollapsible
                color={colors.red100}
            >
                <WidgetErrorAndWarningContent
                    widgetData={error}
                    type={widgetType}
                />
            </Widget>
        </div>
    );
};
