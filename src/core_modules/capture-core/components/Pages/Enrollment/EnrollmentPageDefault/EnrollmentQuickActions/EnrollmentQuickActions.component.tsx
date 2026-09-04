import React, { useState, useMemo, ComponentType } from 'react';
import { useSelector } from 'react-redux';
import i18n from '@dhis2/d2-i18n';
import { colors, spacers, IconAdd16, IconCalendar16 } from '@dhis2/ui';
import { withStyles, WithStyles } from 'capture-core-utils/styles';
import { Widget } from '../../../../Widget';
import { QuickActionButton } from './QuickActionButton/QuickActionButton';
import { tabMode } from '../../../EnrollmentAddEvent/NewEventWorkspace/newEventWorkspace.constants';
import { useNavigate, buildUrlQueryString, useLocationQuery } from '../../../../../utils/routing';
import { useEnrollmentAccessContext } from '../../../common/EnrollmentOverviewDomain/EnrollmentAccessContext';
import { getEnrollmentScopeFormId } from '../../../common/EnrollmentOverviewDomain';
import { OwnProps, ProgramStage, EventCount } from './EnrollmentQuickActions.types';

const styles = {
    contentContainer: {
        padding: `0 ${spacers.dp12} ${spacers.dp12} ${spacers.dp12}`,
        display: 'flex',
        gap: spacers.dp4,
    },
} as const;

type Props = OwnProps & WithStyles<typeof styles>;

const EnrollmentQuickActionsComponentPlain = ({
    stages,
    events,
    classes,
}: Props) => {
    const [open, setOpen] = useState<boolean>(true);
    const { navigate } = useNavigate();
    const { enrollmentId, programId, teiId, orgUnitId } = useLocationQuery();
    const { anyStageWriteAccess } = useEnrollmentAccessContext();

    const hiddenProgramStageIds = useSelector(({ rulesEffectsHiddenProgramStage }: any) =>
        (enrollmentId ? rulesEffectsHiddenProgramStage?.[getEnrollmentScopeFormId(enrollmentId)] : undefined));

    const stagesWithEventCount = useMemo(() => stages.map((stage) => {
        const mutatedStage = { ...stage };
        mutatedStage.eventCount = (events
            ?.filter(event => event.programStage === stage.id)
            ?.length
        );
        return mutatedStage;
    }), [events, stages]);

    const noStageAvailable = useMemo(
        () =>
            stagesWithEventCount.every(
                (programStage: ProgramStage & EventCount) =>
                    (!programStage.dataAccess?.write) ||
                    (!programStage.repeatable && (programStage.eventCount ?? 0) > 0) ||
                    Boolean(hiddenProgramStageIds?.[programStage.id]),
            ),
        [stagesWithEventCount, hiddenProgramStageIds],
    );

    const onNavigationFromQuickActions = (tab: string) => {
        navigate(`/enrollmentEventNew?${buildUrlQueryString({ programId, teiId, enrollmentId, orgUnitId, tab })}`);
    };

    const ready: boolean = events !== undefined && stages !== undefined;

    if (!anyStageWriteAccess) return null;

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
                        icon={<IconAdd16 color={colors.grey700} />}
                        label={i18n.t('New event')}
                        onClickAction={() => onNavigationFromQuickActions(tabMode.REPORT)}
                        dataTest={'quick-action-button-report'}
                        disabled={noStageAvailable}
                    />

                    <QuickActionButton
                        icon={<IconCalendar16 color={colors.grey700} />}
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
