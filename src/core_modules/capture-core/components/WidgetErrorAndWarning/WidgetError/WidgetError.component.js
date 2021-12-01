// @flow
import { colors } from '@dhis2/ui';
import React from 'react';
import { Widget } from '../../Widget';
import { WidgetErrorAndWarningContent } from '../content/WidgetErrorAndWarningContent';
import { widgetTypes } from '../content/WidgetTypes';
import type { Props } from './WidgetError.types';
import { WidgetErrorHeader } from './WidgetErrorHeader';


export const WidgetError = ({ error, classes }: Props) => {
    const widgetType = widgetTypes.ERROR;

    if (!error?.length) {
        return null;
    }

    return (
        <div
            className={classes}
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
