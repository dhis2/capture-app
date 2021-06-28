// @flow
import React from 'react';
import { colors } from '@dhis2/ui';
import { Widget } from '../../Widget';
import type { Props } from './WidgetError.types';
import { WidgetErrorAndWarningContent } from '../content/WidgetErrorAndWarningContent';
import { WidgetErrorHeader } from './WidgetErrorHeader';


export const WidgetError = ({ error, classes }: Props) => {
    const widgetType = 'error';

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
