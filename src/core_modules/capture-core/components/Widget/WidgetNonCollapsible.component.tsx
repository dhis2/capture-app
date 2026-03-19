import React, { type ComponentType } from 'react';
import { WithStyles, withStyles } from 'capture-core-utils/styles';
import { colors, spacers } from '@dhis2/ui';
import { cx } from '@emotion/css';
import type { WidgetNonCollapsiblePropsPlain } from './widgetNonCollapsible.types';

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

type Props = WidgetNonCollapsiblePropsPlain & WithStyles<typeof styles>;

const WidgetNonCollapsiblePlain = ({
    header,
    children,
    color = colors.white,
    borderless = false,
    classes,
}: Props) => (
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

export const WidgetNonCollapsible = withStyles(styles)(WidgetNonCollapsiblePlain) as
    ComponentType<WidgetNonCollapsiblePropsPlain>;
