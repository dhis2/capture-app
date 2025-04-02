import React, { useState, useMemo, ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { colors, spacers, IconAdd24, IconCalendar24 } from '@dhis2/ui';
import { withStyles, WithStyles } from '@material-ui/core';
import type { OutputEffect } from '@dhis2/rules-engine-javascript';
import { Widget } from '../../../../Widget';
import { QuickActionButton } from './QuickActionButton/QuickActionButton';
import { tabMode } from '../../../EnrollmentAddEvent/NewEventWorkspace/newEventWorkspace.constants';
import { useNavigate, buildUrlQueryString } from '../../../../../utils/routing';
import type { ProgramStage, TrackerProgram } from '../../../../../metaData';

const styles = {
    contentContainer: {
        padding: `0 ${spacers.dp16} ${spacers.dp16} ${spacers.dp16}`,
        display: 'flex',
        gap: spacers.dp8,
    },
} as const;

type EventCount = { eventCount?: number };

type Event = { programStage: string };

type OwnProps = {
    stages: Array<ProgramStage & EventCount>,
    events: Array<Event>,
    ruleEffects?: Array<OutputEffect>,
    program: TrackerProgram,
    orgUnitId: string,
    enrollmentId: string,
    teiId: string,
};

type Props = OwnProps & WithStyles<typeof styles>;

const EnrollmentQuickActionsComponentPlain = (
    {
        stages,
        events,
        ruleEffects,
        classes,
        program,
        enrollmentId,
        teiId,
        orgUnitId,
    }: Props) => {
    const [open, setOpen] = useState<boolean>(true);
    const { navigate } = useNavigate();

    const stagesWithEventCount = useMemo(() => stages.map((stage: ProgramStage & EventCount) => {
        const mutatedStage = { ...stage } as (ProgramStage & EventCount);
        mutatedStage.eventCount = (
            events
                ?.filter((event: Event) => event.programStage === stage.id)
                ?.length
        ) ?? 0;
        return mutatedStage;
    }), [events, stages]);

    const hiddenProgramStageRuleEffects = useMemo(
        () => ruleEffects?.filter((ruleEffect: OutputEffect): boolean => ruleEffect.id === 'HIDEPROGRAMSTAGE'),
        [ruleEffects],
    );

    const noStageAvailable = useMemo(
        () =>
            stagesWithEventCount.every(
                (programStage: ProgramStage & EventCount) =>
                    (!programStage.access?.data?.write) ||
                    (!programStage.repeatable && (programStage.eventCount ?? 0) > 0) ||
                    hiddenProgramStageRuleEffects
                        ?.find((ruleEffect: OutputEffect) => ruleEffect.id === programStage.id),
            ),
        [stagesWithEventCount, hiddenProgramStageRuleEffects],
    );

    const onNavigationFromQuickActions = (tab: string) => {
        navigate(`/enrollmentEventNew?${buildUrlQueryString({
            programId: program.id ?? '',
            teiId: teiId ?? '',
            enrollmentId: enrollmentId ?? '',
            orgUnitId: orgUnitId ?? '',
            tab,
        })}`);
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

export const EnrollmentQuickActions =
    withStyles(styles)(EnrollmentQuickActionsComponentPlain) as ComponentType<OwnProps>;
