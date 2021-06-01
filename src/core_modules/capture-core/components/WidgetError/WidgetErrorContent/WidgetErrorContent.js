// @flow
import { colors } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import React from 'react';
import type { ComponentType } from 'react';
import type { contentTypes, renderListItemType } from './WidgetErrorContent.types';

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

const RenderObjectItem = ({ rule, listItem }: renderListItemType) => (
    <li
        key={rule.id}
        className={listItem}
    >
        {rule.message}
    </li>
);


const RenderStringItem = ({ rule, listItem, index }: renderListItemType) => (
    <li
        key={index}
        className={listItem}
    >
        {rule}
    </li>
);


const WidgetErrorContentPlain = ({ widgetData, classes }: contentTypes) => (
    <div className={classes.widgetWrapper}>
        <ul className={classes.unorderedList}>
            {widgetData && widgetData.map((rule, index) => {
                if (typeof rule === 'string') {
                    return (
                        <RenderStringItem
                            rule={rule}
                            listItem={classes.listItem}
                            index={index}
                        />
                    );
                } else if (rule.message) {
                    return (
                        <RenderObjectItem
                            rule={rule}
                            listItem={classes.listItem}
                        />
                    );
                }
                return null;
            })}
        </ul>
    </div>
);

export const WidgetErrorContent: ComponentType<$Diff<contentTypes, CssClasses>> = withStyles(styles)(WidgetErrorContentPlain);
