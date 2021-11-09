// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import { colors, spacersNum } from '@dhis2/ui';
import cx from 'classnames';
import type { WidgetNonCollapsibleProps, WidgetNonCollapsiblePropsPlain } from './widgetNonCollapsible.types';

const styles = {
    container: {
        borderRadius: 3,
        borderStyle: 'solid',
        borderColor: colors.grey400,
        borderWidth: 1,
        '&.borderless': {
            border: 'none',
        },
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: spacersNum.dp16,
        fontWeight: 500,
        fontSize: 16,
        color: colors.grey800,
    },
};

const WidgetNonCollapsiblePlain = ({
    header,
    children,
    color = colors.white,
    borderless = false,
    classes,
}: WidgetNonCollapsiblePropsPlain) => (
    <div
        className={cx(classes.container, { borderless })}
        style={{ backgroundColor: color }}
    >
        <div
            className={classes.header}
            data-test="widget-header"
        >
            {header}
        </div>
        <div
            data-test="widget-contents"
        >
            {children}
        </div>
    </div>
);

export const WidgetNonCollapsible: ComponentType<WidgetNonCollapsibleProps> =
    withStyles(styles)(WidgetNonCollapsiblePlain);
