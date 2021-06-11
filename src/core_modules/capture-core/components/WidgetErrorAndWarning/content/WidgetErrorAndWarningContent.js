// @flow

import React from 'react';
import { spacers, colors, spacersNum } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import cx from 'classnames';
import type { contentTypes, renderObjectType, renderStringType } from './WidgetErrorAndWarningContent.types';

const styles = {
    widgetWrapper: {
        padding: `0px ${spacersNum.dp16}px`,
    },
    unorderedList: {
        padding: `0px ${spacers.dp16}`,
        lineHeight: '1.375',
        fontSize: spacers.dp16,
        fontWeight: 400,
        color: colors.grey900,
        display: 'flex',
        flexDirection: 'column',
        gap: spacers.dp12,
    },
    listItem: {
        '&.error': {
            listStyleType: '"!   "',
            '&::marker': {
                color: colors.red800,
                fontWeight: 700,
            },
        },
        '&.warning': {
            '&::marker': {
                color: colors.yellow900,
                fontWeight: 700,
            },
        },
    },
};

const RenderObjectItem = ({ rule, listItem }: renderObjectType) => (
    <li
        key={rule.id}
        className={listItem}
    >
        {rule.message}
    </li>
);


const RenderStringItem = ({ rule, listItem }: renderStringType) => (
    <li
        className={listItem}
    >
        {rule}
    </li>
);

const widgetType = Object.freeze({
    WARNING: 'warning',
    ERROR: 'error',
});


const WidgetErrorAndWarningContentPlain = ({ widgetData, type, classes }: contentTypes) => {
    const warning = type === widgetType.WARNING;
    const error = type === widgetType.ERROR;
    return (
        <div
            data-test={'widget-content'}
            className={classes.widgetWrapper}
        >
            <ul className={classes.unorderedList}>
                {widgetData && widgetData.map((rule, index) => {
                    if (typeof rule === 'string') {
                        return (
                            <RenderStringItem
                                rule={rule}
                                listItem={cx(classes.listItem, {
                                    warning,
                                    error,
                                })}
                                /* eslint-disable-next-line react/no-array-index-key */
                                key={index}
                            />
                        );
                    } else if (rule.message) {
                        return (
                            <RenderObjectItem
                                rule={rule}
                                key={rule.id}
                                listItem={cx(classes.listItem, {
                                    warning,
                                    error,
                                })}
                            />
                        );
                    }
                    return null;
                })}
            </ul>
        </div>
    );
};

export const WidgetErrorAndWarningContent = withStyles(styles)(WidgetErrorAndWarningContentPlain);
