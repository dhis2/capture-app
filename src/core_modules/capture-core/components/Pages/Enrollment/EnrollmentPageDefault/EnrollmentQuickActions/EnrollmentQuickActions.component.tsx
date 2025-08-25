import React, { useState, useMemo, ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { colors, spacers, IconAdd24, IconCalendar24 } from '@dhis2/ui';
import { withStyles, WithStyles } from '@material-ui/core';
import type { OutputEffect } from '@dhis2/rules-engine-javascript';
import { Widget } from '../../../../Widget';
import { QuickActionButton } from './QuickActionButton/QuickActionButton';
import { tabMode } from '../../../EnrollmentAddEvent/NewEventWorkspace/newEventWorkspace.constants';
import { useNavigate, buildUrlQueryString, useLocationQuery } from '../../../../../utils/routing';
import { OwnProps, ProgramStage, EventCount } from './EnrollmentQuickActions.types';

const styles = {
    contentContainer: {
        padding: `0 ${spacers.dp16} ${spacers.dp16} ${spacers.dp16}`,
        display: 'flex',
        gap: spacers.dp8,
    },
} as const;

type Props = OwnProps & WithStyles<typeof styles>;

const EnrollmentQuickActionsComponentPlain = ({
    stages,
    events,
    ruleEffects,
    classes,
}: Props) => {
    const [open, setOpen] = useState<boolean>(true);
    const { navigate } = useNavigate();
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
        () => ruleEffects?.filter((ruleEffect: OutputEffect): boolean => ruleEffect.type === 'HIDEPROGRAMSTAGE'),
        [ruleEffects],
    );

    const noStageAvailable = useMemo(
        () =>
            stagesWithEventCount.every(
                (programStage: ProgramStage & EventCount) =>
                    (!programStage.dataAccess?.write) ||
                    (!programStage.repeatable && (programStage.eventCount ?? 0) > 0) ||
                    hiddenProgramStageRuleEffects
                        ?.find((ruleEffect: OutputEffect) => ruleEffect.id === programStage.id),
            ),
        [stagesWithEventCount, hiddenProgramStageRuleEffects],
    );

    const onNavigationFromQuickActions = (tab: string) => {
        navigate(`/enrollmentEventNew?${buildUrlQueryString({ programId, teiId, enrollmentId, orgUnitId, tab })}`);
    };

    const ready: boolean = events !== undefined && stages !== undefined;

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
                        label={i18n.t('New event')}
                        onClickAction={() => onNavigationFromQuickActions(tabMode.REPORT)}
                        dataTest={'quick-action-button-report'}
                        disabled={noStageAvailable}
                    />

                    <QuickActionButton
                        icon={<IconCalendar24 color={colors.grey700} />}
                        label={i18n.t('Schedule an event')}
                        onClickAction={() => onNavigationFromQuickActions(tabMode.SCHEDULE)}
                        dataTest={'quick-action-button-schedule'}
                        disabled={noStageAvailable}
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

export const EnrollmentQuickActions =
    withStyles(styles)(EnrollmentQuickActionsComponentPlain) as ComponentType<OwnProps>;
