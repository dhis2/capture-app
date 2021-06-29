// @flow

import React from 'react';
import { spacers, colors, spacersNum } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import cx from 'classnames';
import type { contentTypes, ObjectType, StringType } from './WidgetErrorAndWarningContent.types';
import type { Rule } from '../WidgetError/WidgetError.types';
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


const StringItem = ({ rule, listItem }: StringType) => (
    <li
        className={listItem}
    >
        {rule}
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
                {widgetData?.map((rule: Rule, index) => {
                    if (typeof rule === 'string') {
                        return (
                            <StringItem
                                rule={rule}
                                listItem={cx(classes.listItem, {
                                    warning,
                                    error,
                                })}
                                /* eslint-disable-next-line react/no-array-index-key */
                                key={index}
                            />
                        );
                    } else if (typeof rule === 'object') {
                        return (
                            <ObjectItem
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
