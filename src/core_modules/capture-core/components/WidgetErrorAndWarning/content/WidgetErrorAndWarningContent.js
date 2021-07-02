// @flow

import React from 'react';
import { spacers, colors, spacersNum } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import cx from 'classnames';
import type { contentTypes, ObjectType, StringType, Message } from './WidgetErrorAndWarningContent.types';
import { widgetTypes } from './WidgetTypes';

const styles = {
    widgetWrapper: {
        padding: `0px ${spacersNum.dp16}px`,
    },
    unorderedList: {
        padding: `0px ${spacers.dp16}`,
        marginTop: '0px',
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

const ObjectItem = ({ rule, listItem }: ObjectType) => (
    <li
        key={rule.id}
        className={listItem}
    >
        {rule.message}
    </li>
);


const StringItem = ({ message, listItem }: StringType) => (
    <li
        className={listItem}
    >
        {message}
    </li>
);


const WidgetErrorAndWarningContentPlain = ({ widgetData, type, classes }: contentTypes) => {
    const warning = type === widgetTypes.WARNING;
    const error = type === widgetTypes.ERROR;
    return (
        <div
            data-test="widget-content"
            className={classes.widgetWrapper}
        >
            <ul className={classes.unorderedList}>
                {widgetData?.map((message: Message, index) => {
                    if (typeof message === 'string') {
                        return (
                            <StringItem
                                message={message}
                                listItem={cx(classes.listItem, {
                                    warning,
                                    error,
                                })}
                                /* eslint-disable-next-line react/no-array-index-key */
                                key={index}
                            />
                        );
                    } else if (typeof message === 'object') {
                        return (
                            <ObjectItem
                                rule={message}
                                key={message.id}
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
