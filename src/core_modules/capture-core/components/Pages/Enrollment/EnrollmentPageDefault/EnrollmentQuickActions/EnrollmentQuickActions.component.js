// @flow
import React, { useState, useMemo } from 'react';
// $FlowFixMe
import i18n from '@dhis2/d2-i18n';
import { useHistory } from 'react-router-dom';
import { colors, spacers, IconAdd24, IconCalendar24 } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import { Widget } from '../../../../Widget';
import { QuickActionButton } from './QuickActionButton/QuickActionButton';
import { tabMode } from '../../../EnrollmentAddEvent/NewEventWorkspace/newEventWorkspace.constants';
import { buildUrlQueryString, useLocationQuery } from '../../../../../utils/routing';

const styles = {
    contentContainer: {
        padding: `0 ${spacers.dp16} ${spacers.dp16} ${spacers.dp16}`,
        display: 'flex',
        gap: spacers.dp8,
    },

};

const EnrollmentQuickActionsComponent = ({ stages, events, ruleEffects, classes }) => {
    const [open, setOpen] = useState(true);
    const history = useHistory();
    const { enrollmentId, programId, teiId, orgUnitId } = useLocationQuery();

    const stagesWithEventCount = useMemo(() => stages.map((stage) => {
        const mutatedStage = { ...stage };
        mutatedStage.eventCount = (events
            ?.filter(event => event.programStage === stage.id)
            ?.length
        );
        return mutatedStage;
    }), [events, stages]);

    const hiddenProgramStageRuleEffects = useMemo(
        () => ruleEffects?.filter(ruleEffect => ruleEffect.type === 'HIDEPROGRAMSTAGE'),
        [ruleEffects],
    );

    const noStageAvailable = useMemo(
        () =>
            stagesWithEventCount.every(
                programStage =>
                    (!programStage.dataAccess.write) ||
                    (!programStage.repeatable && programStage.eventCount > 0) ||
                    hiddenProgramStageRuleEffects?.find(ruleEffect => ruleEffect.id === programStage.id),
            ),
        [stagesWithEventCount, hiddenProgramStageRuleEffects],
    );

    const onNavigationFromQuickActions = (tab: string) => {
        history.push(`/enrollmentEventNew?${buildUrlQueryString({ programId, teiId, enrollmentId, orgUnitId, tab })}`);
    };

    const ready = events !== undefined && stages !== undefined;

    return (
        <Widget
            header={i18n.t('Quick actions')}
            open={open}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
        >
            {ready && (
                <div
                    className={classes.contentContainer}
                    data-test={'quick-action-button-container'}
                >
                    <QuickActionButton
                        icon={<IconAdd24 color={colors.grey700} />}
                        label={i18n.t('New Event')}
                        onClickAction={() => onNavigationFromQuickActions(tabMode.REPORT)}
                        dataTest={'quick-action-button-report'}
                        disable={noStageAvailable}
                    />

                    <QuickActionButton
                        icon={<IconCalendar24 color={colors.grey700} />}
                        label={i18n.t('Schedule an event')}
                        onClickAction={() => onNavigationFromQuickActions(tabMode.SCHEDULE)}
                        dataTest={'quick-action-button-schedule'}
                        disable={noStageAvailable}
                    />

                    {/* DHIS2-13016: Should hide Make referral until the feature is developped
                    <QuickActionButton
                    icon={<IconArrowRightMulti24 />}
                    label={i18n.t('Make referral')}
                    onClickAction={() => onNavigationFromQuickActions(tabMode.REFER)}
                    dataTest={'quick-action-button-refer'}
                    disable={noStageAvailable}
                /> */}
                </div>
            )}
        </Widget>
    );
};

export const EnrollmentQuickActions = withStyles(styles)(EnrollmentQuickActionsComponent);
