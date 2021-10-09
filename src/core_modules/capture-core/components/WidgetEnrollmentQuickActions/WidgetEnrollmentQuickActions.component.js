// @flow
import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { spacers, IconAdd24, IconCalendar24, IconArrowRightMulti24 } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import { Widget } from '../Widget';
import { QuickActionButton } from './QuickActionButton/QuickActionButton';

const styles = {
    contentContainer: {
        padding: `5px ${spacers.dp16} ${spacers.dp24} ${spacers.dp16}`,
        display: 'flex',
        gap: spacers.dp8,
    },

};

const WidgetEnrollmentQuickActionsComponent = ({ classes }) => {
    const [open, setOpen] = useState(true);

    return (
        <Widget
            header={i18n.t('Quick actions')}
            open={open}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
        >
            <div
                className={classes.contentContainer}
            >
                <QuickActionButton
                    icon={<IconAdd24 />}
                    label={i18n.t('New Event')}
                />

                <QuickActionButton
                    icon={<IconCalendar24 />}
                    label={i18n.t('Schedule an event')}
                />

                <QuickActionButton
                    icon={<IconArrowRightMulti24 />}
                    label={i18n.t('Make referral')}
                />
            </div>
        </Widget>
    );
};

export const WidgetEnrollmentQuickActions = withStyles(styles)(WidgetEnrollmentQuickActionsComponent);
