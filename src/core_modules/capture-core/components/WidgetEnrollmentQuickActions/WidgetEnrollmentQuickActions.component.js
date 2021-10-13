// @flow
import React, { useState } from 'react';
// $FlowFixMe
import { shallowEqual, useSelector } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { useHistory } from 'react-router';
import { spacers, IconAdd24, IconCalendar24, IconArrowRightMulti24 } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import { Widget } from '../Widget';
import { QuickActionButton } from './QuickActionButton/QuickActionButton';
import { QuickActionTabTypes } from './WidgetEnrollmentQuickActions.constants';
import { urlArguments } from '../../utils/url';

const styles = {
    contentContainer: {
        padding: `5px ${spacers.dp16} ${spacers.dp24} ${spacers.dp16}`,
        display: 'flex',
        gap: spacers.dp8,
    },

};

const WidgetEnrollmentQuickActionsComponent = ({ classes }) => {
    const [open, setOpen] = useState(true);
    const history = useHistory();
    const { enrollmentId, programId, teiId, orgUnitId } = useSelector(
        ({
            router: {
                location: { query },
            },
        },
        ) => (
            { enrollmentId: query.enrollmentId,
                teiId: query.teiId,
                programId: query.programId,
                orgUnitId: query.orgUnitId,
            }), shallowEqual);

    const onNavigationFromQuickActions = (tab: string) => {
        history.push(`/enrollmentEventNew?${urlArguments({ programId, teiId, enrollmentId, orgUnitId })}&tab=${tab}`);
    };

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
                    onClickAction={() => onNavigationFromQuickActions(QuickActionTabTypes.NEW)}
                    dataTest={'quick-action-button-new'}
                />

                <QuickActionButton
                    icon={<IconCalendar24 />}
                    label={i18n.t('Schedule an event')}
                    onClickAction={() => onNavigationFromQuickActions(QuickActionTabTypes.SCHEDULE)}
                    dataTest={'quick-action-button-schedule'}
                />

                <QuickActionButton
                    icon={<IconArrowRightMulti24 />}
                    label={i18n.t('Make referral')}
                    onClickAction={() => onNavigationFromQuickActions(QuickActionTabTypes.REFER)}
                    dataTest={'quick-action-button-refer'}
                />
            </div>
        </Widget>
    );
};

export const WidgetEnrollmentQuickActions = withStyles(styles)(WidgetEnrollmentQuickActionsComponent);
