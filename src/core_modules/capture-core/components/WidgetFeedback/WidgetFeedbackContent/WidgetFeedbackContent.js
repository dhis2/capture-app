// @flow

import React, { type ComponentType } from 'react';
import { spacersNum } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import type { contentProps } from '../WidgetFeedback.types';

const styles = {
    container: {
        padding: `0px ${spacersNum.dp16}px`,
    },
    unorderedList: {
        paddingLeft: '20px',
        lineHeight: '1.375',
    },
    noFeedbackText: {
        color: '#6B7280',
    },
    listItem: {
        marginBottom: '5px',
    },
};

const WidgetFeedbackContentComponent = ({ filteredText, filteredKeyValue, classes }: contentProps) => {

    return (
        <div className={classes.container}>
            {!filteredText.length > 0 && !filteredKeyValue.length > 0 ?
                <p className={classes.noFeedbackText}>No feedback for this enrollment yet</p> : <ul className={classes.unorderedList}>
                    {filteredText && filteredText.length > 0 ? filteredText.map(item => (
                        <li
                            className={classes.listItem}
                            key={item.displayText.id}
                        >
                            {item.displayText.message}
                        </li>)) : null}
                    {filteredKeyValue && filteredKeyValue.length > 0 ? filteredKeyValue.map(item => (
                        <li
                            key={item.id}
                            className={classes.listItem}
                        >
                            {item.displayKeyValuePair.value}
                        </li>)) : null}
                </ul>
            }

        </div>
    );
};

export const WidgetFeedbackContent: ComponentType<$Diff<contentProps, CssClasses>> = withStyles(styles)(WidgetFeedbackContentComponent);
