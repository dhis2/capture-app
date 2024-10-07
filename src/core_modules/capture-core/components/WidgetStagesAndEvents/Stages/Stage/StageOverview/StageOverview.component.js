// @flow
import React, { type ComponentType } from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core';
import { useTimeZoneConversion } from '@dhis2/app-runtime';
import {
    colors, spacers, spacersNum, IconInfo16, IconWarning16, IconCalendar16, IconClockHistory16, Tooltip,
} from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import moment from 'moment';
import { statusTypes } from 'capture-core/events/statusTypes';
import { NonBundledDhis2Icon } from '../../../../NonBundledDhis2Icon';
import type { Props } from './stageOverview.types';
import { isEventOverdue } from '../StageDetail/hooks/helpers';

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        padding: '0',
        justifyContent: 'space-between',
        width: '100%',
        marginLeft: '-4px',
    },
    icon: {
        paddingRight: spacersNum.dp8,
    },
    descriptionIcon: {
        marginLeft: spacersNum.dp4,
        marginRight: spacersNum.dp8,
        height: '16px',
    },
    infoTitles: {
        display: 'flex',
        alignItems: 'center',
    },
    infoItems: {
        display: 'flex',
        gap: spacers.dp12,
    },
    indicatorIcon: {
        paddingRight: spacersNum.dp4,
        height: '16px',
    },
    title: {
        fontSize: '18px',
        lineHeight: '19px',
        fontWeight: 500,
        color: colors.grey900,
        display: 'flex',
        marginInlineEnd: spacers.dp4,
    },
    indicator: {
        color: colors.grey800,
        fontSize: '12px',
        lineHeight: '16px',
        fontWeight: 400,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
    },
    warningIndicator: {
        color: colors.red700,
    },
};

const getLastUpdatedAt = (events, fromServerDate) => {
    const lastEventUpdated = events.reduce((acc, event) => (
        new Date(acc.updatedAt).getTime() > new Date(event.updatedAt).getTime() ? acc : event
    ));

    if (lastEventUpdated) {
        const { updatedAt } = lastEventUpdated;
        return lastEventUpdated?.updatedAt && moment(updatedAt).isValid()
            ? (
                <>
                    {i18n.t('Last updated')}&nbsp;
                    <Tooltip content={fromServerDate(updatedAt).toLocaleString()}>
                        {moment(fromServerDate(updatedAt)).fromNow()}
                    </Tooltip>
                </>
            )
            : null;
    }
    return null;
};

export const StageOverviewPlain = ({ title, icon, description, events, classes }: Props) => {
    const { fromServerDate } = useTimeZoneConversion();
    const totalEvents = events.length;
    const overdueEvents = events.filter(isEventOverdue).length;
    const scheduledEvents = events.filter(event => event.status === statusTypes.SCHEDULE).length;

    return (<div className={classes.container}>
        <div className={classes.infoTitles}>
            {
                icon && (
                    <div className={classes.icon}>
                        <NonBundledDhis2Icon
                            name={icon.name}
                            color={icon.color}
                            width={32}
                            height={32}
                            cornerRadius={5}
                        />
                    </div>
                )
            }
            <div />

            <div className={classes.title}>
                {title}
            </div>
            {description &&
                <Tooltip
                    content={description}
                    openDelay={100}
                >
                    <div className={classes.descriptionIcon}>
                        <IconInfo16 />
                    </div>
                </Tooltip>
            }
        </div>
        <div className={classes.infoItems}>
            <div className={classes.indicator}>
                {i18n.t('{{ count }} event', {
                    count: totalEvents,
                    defaultValue: '{{ count }} event',
                    defaultValue_plural: '{{count}} events',
                })}
            </div>
            {overdueEvents > 0 ? <div className={cx(classes.indicator, classes.warningIndicator)}>
                <div className={classes.indicatorIcon}>
                    <IconWarning16 />
                </div>
                {i18n.t('{{ overdueEvents }} overdue', { overdueEvents })}
            </div> : null}
            {scheduledEvents > 0 ? <div className={classes.indicator}>
                <div className={classes.indicatorIcon}>
                    <IconCalendar16 />
                </div>
                {i18n.t('{{ scheduledEvents }} scheduled', { scheduledEvents })}
            </div> : null}
            {totalEvents > 0 && <div className={cx(classes.indicator)}>
                <div className={classes.indicatorIcon}>
                    <IconClockHistory16 />
                </div>
                {getLastUpdatedAt(events, fromServerDate)}
            </div>}
        </div>
    </div>);
};

export const StageOverview: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(StageOverviewPlain);
