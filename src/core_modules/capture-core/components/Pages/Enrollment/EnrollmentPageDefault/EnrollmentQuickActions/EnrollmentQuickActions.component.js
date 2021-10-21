// @flow
import React, { useState, useMemo } from 'react';
// $FlowFixMe
import i18n from '@dhis2/d2-i18n';
import { useHistory } from 'react-router-dom';
import { spacers, IconAdd24, IconCalendar24, IconArrowRightMulti24 } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import { Widget } from '../../../../Widget';
import { QuickActionButton } from './QuickActionButton/QuickActionButton';
import { urlArguments } from '../../../../../utils/url';
import { tabMode } from '../../../EnrollmentAddEvent/NewEventWorkspace/newEventWorkspace.constants';
import { useLocationQuery } from '../../../../../utils/routing';

const styles = {
    contentContainer: {
        padding: `0 ${spacers.dp16} ${spacers.dp24} ${spacers.dp16}`,
        display: 'flex',
        gap: spacers.dp8,
    },

};

const EnrollmentQuickActionsComponent = ({ stages, events, classes }) => {
    const [open, setOpen] = useState(true);
    const history = useHistory();
    const { enrollmentId, programId, teiId, orgUnitId } = useLocationQuery();

    const programStages = useMemo(() => stages.map((stage) => {
        stage.eventCount = (events
                ?.filter(event => event.programStage === stage.id)
                ?.length
        );
        return stage;
    }), [events, stages]);

    const availableStage = useMemo(
        () => programStages.every(programStage =>
            (!programStage.repeatable && programStage.eventCount > 0),
        ), [programStages]);

    const onNavigationFromQuickActions = (tab: string) => {
        history.push(`/enrollmentEventNew?${urlArguments({ programId, teiId, enrollmentId, orgUnitId, tab })}`);
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
                data-test={'quick-action-button-container'}
            >
                <QuickActionButton
                    icon={<IconAdd24 />}
                    label={i18n.t('New Event')}
                    onClickAction={() => onNavigationFromQuickActions(tabMode.REPORT)}
                    dataTest={'quick-action-button-report'}
                    disable={availableStage}
                />

                <QuickActionButton
                    icon={<IconCalendar24 />}
                    label={i18n.t('Schedule an event')}
                    onClickAction={() => onNavigationFromQuickActions(tabMode.SCHEDULE)}
                    dataTest={'quick-action-button-schedule'}
                    disable={availableStage}
                />

                <QuickActionButton
                    icon={<IconArrowRightMulti24 />}
                    label={i18n.t('Make referral')}
                    onClickAction={() => onNavigationFromQuickActions(tabMode.REFER)}
                    dataTest={'quick-action-button-refer'}
                    disable={availableStage}
                />
            </div>
        </Widget>
    );
};

export const EnrollmentQuickActions = withStyles(styles)(EnrollmentQuickActionsComponent);
