import React, { useCallback, useMemo, useState, ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { colors, IconChevronRight16 } from '@dhis2/ui';
import { useWorkingListLabel } from './hooks/useWorkingListLabel';
import { BreadcrumbItem } from '../common/BreadcrumbItem';
import { defaultDialogProps } from '../../Dialogs/DiscardDialog.constants';
import { DiscardDialog } from '../../Dialogs/DiscardDialog.component';
import {
    EnrollmentPageKeys,
} from '../../Pages/common/EnrollmentOverviewDomain/EnrollmentPageLayout/DefaultEnrollmentLayout.constants';

type EnrollmentPageKeyTypes = typeof EnrollmentPageKeys[keyof typeof EnrollmentPageKeys];

export const EventStatuses = {
    ACTIVE: 'ACTIVE',
    COMPLETED: 'COMPLETED',
    SKIPPED: 'SKIPPED',
    SCHEDULE: 'SCHEDULE',
    OVERDUE: 'OVERDUE',
} as const;

type EventStatus = typeof EventStatuses[keyof typeof EventStatuses];

type OwnProps = {
    onBackToMainPage: () => void;
    onBackToDashboard?: () => void;
    onBackToViewEvent?: () => void;
    displayFrontPageList: boolean;
    programId: string;
    userInteractionInProgress?: boolean;
    eventStatus?: EventStatus;
    page: 'mainPage' | EnrollmentPageKeyTypes;
};
type WarningKey = typeof pageKeys[keyof typeof pageKeys];

type Props = OwnProps & WithStyles<typeof styles>;


const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
    },
} as const;

const pageKeys = {
    MAIN_PAGE: 'mainPage',
    ...EnrollmentPageKeys,
} as const;

const eventIsScheduled = (eventStatus?: EventStatus): boolean =>
    !!eventStatus &&
    ([EventStatuses.SCHEDULE, EventStatuses.OVERDUE, EventStatuses.SKIPPED] as EventStatus[])
        .includes(eventStatus);


const BreadcrumbsPlain = ({
    onBackToMainPage,
    onBackToDashboard,
    onBackToViewEvent,
    eventStatus,
    programId,
    displayFrontPageList,
    userInteractionInProgress = false,
    page,
    classes,
}: Props) => {
    const [openWarning, setOpenWarning] = useState<WarningKey | null>(null);

    const { label } = useWorkingListLabel({
        programId,
        displayFrontPageList,
    });

    const handleNavigation = useCallback((callback?: () => void, warningType?: WarningKey) => {
        if (userInteractionInProgress && warningType) {
            setOpenWarning(warningType);
        } else {
            callback && callback();
        }
    }, [userInteractionInProgress]);

    type BreadcrumbItemType = {
        key: WarningKey;
        onClick: () => void;
        label: string;
        selected: boolean;
        condition: boolean;
    };

    const breadcrumbItems = useMemo<BreadcrumbItemType[]>(() => ([
        {
            key: pageKeys.MAIN_PAGE,
            onClick: () => handleNavigation(onBackToMainPage, pageKeys.MAIN_PAGE),
            label,
            selected: false,
            condition: true,
        },
        {
            key: pageKeys.OVERVIEW,
            onClick: () => handleNavigation(onBackToDashboard, pageKeys.OVERVIEW),
            label: i18n.t('Enrollment dashboard'),
            selected: page === pageKeys.OVERVIEW,
            condition: true,
        },
        {
            key: pageKeys.VIEW_EVENT,
            onClick: () => handleNavigation(onBackToViewEvent, pageKeys.VIEW_EVENT),
            label: i18n.t('View event'),
            selected: page === pageKeys.VIEW_EVENT,
            condition: page === pageKeys.VIEW_EVENT ||
                (page === pageKeys.EDIT_EVENT && !eventIsScheduled(eventStatus)),
        },
        {
            key: pageKeys.EDIT_EVENT,
            onClick: () => undefined,
            label: i18n.t('Edit event'),
            selected: page === pageKeys.EDIT_EVENT,
            condition: page === pageKeys.EDIT_EVENT,
        },
        {
            key: pageKeys.NEW_EVENT,
            onClick: () => undefined,
            label: i18n.t('New event'),
            selected: page === pageKeys.NEW_EVENT,
            condition: page === pageKeys.NEW_EVENT,
        },
    ] as BreadcrumbItemType[]).filter((item): item is BreadcrumbItemType => item.condition), [
        label,
        page,
        eventStatus,
        handleNavigation,
        onBackToMainPage,
        onBackToDashboard,
        onBackToViewEvent,
    ]);

    return (
        <div className={classes.container}>
            {breadcrumbItems.map((button, index) => (
                <React.Fragment key={button.key}>
                    <BreadcrumbItem
                        label={button.label}
                        onClick={button.onClick}
                        selected={button.selected}
                        dataTest={`enrollment-breadcrumb-${button.key}-item`}
                    />
                    {index < (breadcrumbItems.length - 1) && (
                        <IconChevronRight16 color={colors.grey800} />
                    )}
                </React.Fragment>
            ))}

            <DiscardDialog
                open={openWarning === pageKeys.MAIN_PAGE}
                onDestroy={() => {
                    setOpenWarning(null);
                    onBackToMainPage?.();
                }}
                onCancel={() => setOpenWarning(null)}
                {...defaultDialogProps}
            />

            <DiscardDialog
                open={openWarning === pageKeys.OVERVIEW}
                onDestroy={() => {
                    setOpenWarning(null);
                    onBackToDashboard?.();
                }}
                onCancel={() => setOpenWarning(null)}
                {...defaultDialogProps}
            />

            <DiscardDialog
                open={openWarning === pageKeys.VIEW_EVENT}
                onDestroy={() => {
                    setOpenWarning(null);
                    onBackToViewEvent?.();
                }}
                onCancel={() => setOpenWarning(null)}
                {...defaultDialogProps}
            />
        </div>
    );
};

export const EnrollmentBreadcrumb = withStyles(styles)(BreadcrumbsPlain) as ComponentType<OwnProps>;
