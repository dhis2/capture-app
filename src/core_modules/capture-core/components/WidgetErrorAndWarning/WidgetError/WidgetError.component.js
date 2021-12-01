// @flow
import React from 'react';
import { colors } from '@dhis2/ui';
import { widgetTypes } from '../content/WidgetTypes';
import { WidgetErrorAndWarningContent } from '../content/WidgetErrorAndWarningContent';
import { Widget } from '../../Widget';
import { WidgetErrorHeader } from './WidgetErrorHeader';
import type { Props } from './WidgetError.types';


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
