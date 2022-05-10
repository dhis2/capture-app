// @flow

import React, { type ComponentType } from 'react';
import { withStyles } from '@material-ui/core';
import { spacers, colors } from '@dhis2/ui';
import cx from 'classnames';
import type {
    ContentType,
    FilteredKeyValue,
    FilteredText,
} from '../../WidgetFeedback/WidgetFeedback.types';
import { sortIndicatorsFn } from './sortIndicatorsFn';

const styles = {
    container: {
        paddingLeft: spacers.dp16,
        paddingRight: spacers.dp16,
        paddingBottom: spacers.dp24,
        fontWeight: 400,
    },
    indicatorRow: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '5px',
        borderBottom: `1px solid ${colors.grey400}`,
        padding: `${spacers.dp12} ${spacers.dp8}`,
        color: colors.grey800,
        lineHeight: '1.375',
        '&.isLastItem': {
            borderBottom: 'none',
            paddingBottom: 0,
        },
    },
    indicatorValue: {
        color: colors.grey900,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    },
    noIndicatorText: {
        margin: 0,
        color: colors.grey600,
    },
    legendBullet: {
        height: spacers.dp8,
        width: spacers.dp8,
        borderRadius: '10px',
    },
};

const WidgetIndicatorContentComponent = ({ widgetData, emptyText, classes }: ContentType) => {
    if (!widgetData?.length) {
        return (
            <div className={classes.container}>
                <p className={classes.noIndicatorText}>{emptyText}</p>
            </div>);
    }
    const sortedWidgetData = widgetData.sort(sortIndicatorsFn);

    const renderLegend = color => (
        <div className={classes.legendBullet} style={{ backgroundColor: color }} />
    );

    const renderString = (indicator: string, index: number, isLastItem: boolean) => (
        <div
            key={index}
            className={cx(classes.indicatorRow, { isLastItem })}
        >
            <div>{indicator}</div>
        </div>
    );

    const renderTextObject = (indicator: FilteredText, isLastItem: boolean) => (
        <div
            key={indicator.id}
            className={cx(classes.indicatorRow, { isLastItem })}
        >
            <div>{indicator.message}</div>
            {indicator.color ? <div className={classes.indicatorValue}>{renderLegend(indicator.color)}</div> : null}
        </div>
    );

    const renderKeyValue = (indicator: FilteredKeyValue, isLastItem: boolean) => (
        <div
            key={indicator.id}
            className={cx(classes.indicatorRow, { isLastItem })}
        >
            <div>{indicator.key}</div>
            {(String(indicator.value) || indicator.color) && ( // convert to string to make sure 0 gets displayed
                <div className={classes.indicatorValue}>
                    {indicator.color ? renderLegend(indicator.color) : null}
                    {indicator.value}
                </div>
            )
            }
        </div>
    );

    return (
        <div className={classes.container}>
            {sortedWidgetData.map((action: any, index: number) => {
                const isLast = (index + 1) === widgetData.length;
                if (action.key) {
                    return renderKeyValue(action, isLast);
                } else if (action.message) {
                    return renderTextObject(action, isLast);
                } else if (typeof action === 'string') {
                    return renderString(action, index, isLast);
                }
                return null;
            }) }
        </div>
    );
};

export const WidgetIndicatorContent: ComponentType<$Diff<ContentType, CssClasses>> = withStyles(styles)(WidgetIndicatorContentComponent);
