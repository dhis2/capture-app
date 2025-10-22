import React, { type ComponentType } from 'react';
import { withStyles, type WithStyles } from '@material-ui/core';
import { spacers, colors } from '@dhis2/ui';
import cx from 'classnames';
import type {
    FilteredIndicatorKeyValue,
    FilteredIndicatorText,
    IndicatorWidgetData,
    IndicatorProps,
} from '../WidgetIndicator.types';
import { sortIndicatorsFn } from './sortIndicatorsFn';

const styles = {
    container: {
        padding: `0 ${spacers.dp16}`,
        marginBottom: spacers.dp16,
        fontWeight: 400,
    },
    indicatorRow: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '4px',
        borderBottom: `1px solid ${colors.grey300}`,
        padding: `${spacers.dp12} 0`,
        color: colors.grey800,
        fontSize: '14px',
        lineHeight: '19px',
        '&.isLastItem': {
            borderBottom: 'none',
            paddingBottom: 0,
        },
    },
    indicatorValue: {
        color: colors.grey900,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
    },
    noIndicatorText: {
        margin: 0,
        color: colors.grey600,
        fontSize: '14px',
        lineHeight: '19px',
    },
    legendBullet: {
        height: spacers.dp8,
        width: spacers.dp8,
        borderRadius: '10px',
    },
};

type Props = IndicatorProps & WithStyles<typeof styles>;

const WidgetIndicatorContentComponent = ({ indicators, indicatorEmptyText, classes }: Props) => {
    if (!indicators?.length) {
        return (
            <div className={classes.container}>
                <p className={classes.noIndicatorText}>{indicatorEmptyText}</p>
            </div>);
    }
    const sortedWidgetData = indicators.sort(sortIndicatorsFn);

    const renderLegend = (color: string) => (
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

    const renderTextObject = (indicator: FilteredIndicatorText, isLastItem: boolean) => (
        <div
            key={indicator.id}
            className={cx(classes.indicatorRow, { isLastItem })}
        >
            <div>{indicator.message}</div>
            {indicator.color ? <div className={classes.indicatorValue}>{renderLegend(indicator.color)}</div> : null}
        </div>
    );

    const renderKeyValue = (indicator: FilteredIndicatorKeyValue, isLastItem: boolean) => (
        <div
            key={indicator.id}
            className={cx(classes.indicatorRow, { isLastItem })}
        >
            <div>{indicator.key}</div>
            {(indicator.value || indicator.color) && (
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
            {sortedWidgetData.map((action: IndicatorWidgetData, index: number) => {
                const isLast = (index + 1) === indicators.length;
                if (typeof action === 'object') {
                    if ('key' in action) {
                        return renderKeyValue(action as FilteredIndicatorKeyValue, isLast);
                    } else if ('message' in action) {
                        return renderTextObject(action as FilteredIndicatorText, isLast);
                    }
                } else if (typeof action === 'string') {
                    return renderString(action, index, isLast);
                }
                return null;
            }) }
        </div>
    );
};

export const WidgetIndicatorContent =
    withStyles(styles)(WidgetIndicatorContentComponent) as ComponentType<IndicatorProps>;
