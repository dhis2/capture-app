// @flow
import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import { colors, spacers } from '@dhis2/ui';
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
        minHeight: '44px', // match the height of the collapsible version
        padding: `${spacers.dp8} ${spacers.dp8} ${spacers.dp8} ${spacers.dp12}`,
        fontWeight: 500,
        fontSize: 15,
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
        {header && (
            <div
                className={classes.header}
                data-test="widget-header"
            >
                {header}
            </div>
        )}
        <div
            data-test="widget-contents"
        >
            {children}
        </div>
    </div>
);

export const WidgetNonCollapsible: ComponentType<WidgetNonCollapsibleProps> =
    withStyles(styles)(WidgetNonCollapsiblePlain);
