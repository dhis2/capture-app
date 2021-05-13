// @flow
import React, { type ComponentType } from 'react';
import cx from 'classnames';
import { withStyles, Tooltip } from '@material-ui/core';
import { colors, spacersNum, IconInfo16 } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import moment from 'moment';
import { NonBundledDhis2Icon } from '../../../../NonBundledDhis2Icon';
import type { Props } from './stageOverview.types';

const styles = {
    container: {
        display: 'flex',
        padding: spacersNum.dp8,
        alignItems: 'center',
    },
    icon: {
        paddingRight: spacersNum.dp8,

    },
    descriptionIcon: {
        paddingLeft: spacersNum.dp4,
        paddingRight: spacersNum.dp4,
    },
    title: {
        fontSize: 18,
        lineHeight: 1.556,
        fontWeight: 500,
        color: colors.grey900,
        display: 'flex',
    },
    indicator: {
        padding: spacersNum.dp8,
        color: colors.grey600,
    },
    smallText: {
        fontSize: 13,
    },
};
export const StageOverviewPlain = ({ title, icon, description, events, classes }: Props) => (
    <div className={classes.container}>

        {
            icon && (
                <div className={classes.icon}>
                    <NonBundledDhis2Icon
                        name={icon.name}
                        color={icon.color}
                        width={30}
                        height={30}
                        cornerRadius={2}
                    />
                </div>
            )
        }

        <div className={classes.title}>
            {title}
        </div>
        <Tooltip
            title={description}
            placement="top"
        >
            <div className={classes.descriptionIcon}>
                <IconInfo16 />
            </div>
        </Tooltip>

        <div className={classes.indicator}>
            {events.length > 1
                ? i18n.t('{{ totalEvents }} events', { totalEvents: events.length })
                : i18n.t('1 event')}
        </div>
        <div className={cx(classes.smallText, classes.indicator)}>
            {i18n.t('Last updated {{date}}', { date: moment(events[0].lastUpdated).fromNow() })}
        </div>
    </div>
);

export const StageOverview: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(StageOverviewPlain);
