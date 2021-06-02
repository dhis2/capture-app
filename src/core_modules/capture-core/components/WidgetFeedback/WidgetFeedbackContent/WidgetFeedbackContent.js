// @flow

import React, { type ComponentType } from 'react';
import { spacersNum, colors } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core';
import type { Props } from '../WidgetFeedback.types';

const styles = {
    container: {
        padding: `0px ${spacersNum.dp16}px`,
    },
    unorderedList: {
        paddingLeft: spacersNum.dp16,
        marginTop: '0px',
        lineHeight: '1.375',
        fontSize: '14px',
        color: colors.grey900,
    },
    noFeedbackText: {
        color: colors.grey600,
        paddingLeft: spacersNum.dp16,
        fontWeight: 400,
        fontSize: '14px',
        marginTop: '0px',
    },
    listItem: {
        marginBottom: spacersNum.dp4,
        '&::marker': {
            color: colors.grey500,
        },
    },
};


const WidgetFeedbackContentComponent = ({ displayText, displayKeyValue, classes }: Props) => {
    if (!displayText?.length > 0 && !displayKeyValue?.length > 0) {
        return <p className={classes.noFeedbackText}>{i18n.t('No feedback for this enrollment yet')}</p>;
    }

    const renderText = () => (
        displayText?.map(item => (
            item.message && (
                <li
                    className={classes.listItem}
                    key={item.id}
                >
                    {item.message}
                </li>
            )))
    );

    const renderKeyValue = () => (
        displayKeyValue?.map(item => (
            item.key && item.value && (
                <li
                    key={item.id}
                    className={classes.listItem}
                >
                    {item.key}: {item.value}
                </li>
            )))
    );

    return (
        <div className={classes.container}>
            <ul className={classes.unorderedList}>
                {renderText()}
                {renderKeyValue()}
            </ul>
        </div>
    );
};

export const WidgetFeedbackContent: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(WidgetFeedbackContentComponent);
