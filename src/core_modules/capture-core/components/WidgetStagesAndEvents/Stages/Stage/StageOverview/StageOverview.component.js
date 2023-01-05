// @flow
import React, { type ComponentType } from 'react';
import cx from 'classnames';
import { withStyles } from '@material-ui/core';
import { colors, spacersNum, IconInfo16, IconWarning16, IconCalendar16, IconClockHistory16, Tooltip } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import moment from 'moment-timezone';
import { statusTypes } from 'capture-core/events/statusTypes';
import { NonBundledDhis2Icon } from '../../../../NonBundledDhis2Icon';
import type { Props } from './stageOverview.types';
import { isEventOverdue } from '../StageDetail/hooks/helpers';
import { useSystemSettingsFromIndexedDB } from '../../../../../utils/cachedDataHooks/useSystemSettingsFromIndexedDB';

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        paddingRight: spacersNum.dp8,
    },
    descriptionIcon: {
        marginLeft: spacersNum.dp4,
        marginRight: spacersNum.dp8,
        height: '16px',
    },
    indicatorIcon: {
        paddingRight: spacersNum.dp4,
        height: '16px',
    },
    title: {
        fontSize: '14px',
        lineHeight: '19px',
        fontWeight: 500,
        color: colors.grey900,
        display: 'flex',
    },
    indicator: {
        padding: spacersNum.dp8,
        color: colors.grey800,
        fontSize: '14px',
        fontWeight: 400,
        display: 'flex',
        alignItems: 'center',
    },
    warningIndicator: {
        color: colors.red700,
    },
};

const getLastUpdatedAt = (serverTimeZoneId, events) => {
    const lastEventUpdated = events.reduce((acc, event) => (
        new Date(acc.updatedAt).getTime() > new Date(event.updatedAt).getTime() ? acc : event
    ));

    if (lastEventUpdated) {
        const { updatedAt } = lastEventUpdated;
        return lastEventUpdated?.updatedAt && moment(updatedAt).isValid()
            ? i18n.t('Last updated {{date}}', {
                date: serverTimeZoneId
                    ? moment.tz(updatedAt, serverTimeZoneId).fromNow()
                    : moment(updatedAt).fromNow(),
            })
            : null;
    }
    return null;
};

export const StageOverviewPlain = ({ title, icon, description, events, classes }: Props) => {
    const { systemSettings } = useSystemSettingsFromIndexedDB('serverTimeZoneId');
    const totalEvents = events.length;
    const overdueEvents = events.filter(isEventOverdue).length;
    const scheduledEvents = events.filter(event => event.status === statusTypes.SCHEDULE).length;

    return (<div className={classes.container}>
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

        <div className={classes.title}>
            {title}
        </div>
        { description &&
            <Tooltip
                content={description}
                openDelay="100"
            >
                <div className={classes.descriptionIcon}>
                    <IconInfo16 />
                </div>
            </Tooltip>
        }
        <div className={classes.indicator}>
            {i18n.t('{{ totalEvents }} events', { totalEvents })}
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
        </div> : null }
        {totalEvents > 0 && <div className={cx(classes.indicator)}>
            <div className={classes.indicatorIcon}>
                <IconClockHistory16 />
            </div>
            {getLastUpdatedAt(systemSettings?.serverTimeZoneId, events)}
        </div>}
    </div>);
};

export const StageOverview: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(StageOverviewPlain);
