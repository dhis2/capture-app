// @flow

import React from 'react';
import { colors } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import cx from 'classnames';
import type { contentTypes, renderObjectType, renderStringType } from './WidgetErrorAndWarningContent.types';

const styles = {
    widgetWrapper: {
        display: 'flex',
        flexDirection: 'column',
        padding: '10px 0',
        '&.warning': {
            backgroundColor: colors.yellow050,
        },
        '&.error': {
            backgroundColor: colors.red100,
        },
    },
    unorderedList: {
        paddingLeft: '15px',
        margin: '0px',
        lineHeight: '1.375',
        fontSize: '14px',
        '&.warning': {
            color: colors.grey900,
        },
        '&.error': {
            color: colors.red200,
        },
    },
    listItem: {
        padding: '5px',
        '&.error': {
            '&::marker': {
                content: '"!"',
                color: colors.red800,
            },
        },
        '&.warning': {
            '&::marker': {
                content: '"•"',
                color: colors.yellow900,
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
        <div className={cx(classes.widgetWrapper, {
            warning,
            error,
        })}
        >
            <ul className={cx(classes.unorderedList, {
                warning,
            })}
            >
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
