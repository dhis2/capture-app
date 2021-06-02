// @flow

import React from 'react';
import { colors } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import type { ComponentType } from 'react';
import type { contentTypes, renderObjectType, renderStringType } from './WidgetErrorAndWarningContent.types';

const styles = {
    widgetWrapper: {
        backgroundColor: colors.red100,
        display: 'flex',
        flexDirection: 'column',
        padding: '10px 0',
    },
    unorderedList: {
        paddingLeft: '15px',
        margin: '0px',
        lineHeight: '1.375',
        fontSize: '14px',
        color: colors.gray900,
    },
    listItem: {
        padding: '5px',
        '&::marker': {
            content: '"!"',
            color: colors.red800,
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


const WidgetErrorAndWarningContentPlain = ({ widgetData, classes }: contentTypes) => {
    return (
        <div className={classes.widgetWrapper}>
            <ul className={classes.unorderedList}>
                {widgetData && widgetData.map((rule, index) => {
                    if (typeof rule === 'string') {
                        return (
                            <RenderStringItem
                                rule={rule}
                                listItem={classes.listItem}
                                key={index}
                            />
                        );
                    } else if (rule.message) {
                        return (
                            <RenderObjectItem
                                rule={rule}
                                key={rule.id}
                                listItem={classes.listItem}
                            />
                        );
                    }
                    return null;
                })}
            </ul>
        </div>
    );
};

export const WidgetErrorAndWarningContent: ComponentType<$Diff<contentTypes, CssClasses>> = withStyles(styles)(WidgetErrorAndWarningContentPlain);
