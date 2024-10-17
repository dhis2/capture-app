// @flow
import type { ComponentType } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/styles';
import { colors, IconChevronRight16 } from '@dhis2/ui';
import { useWorkingListLabel } from './hooks/useWorkingListLabel';
import { BreadcrumbItem } from '../common/BreadcrumbItem';
import { defaultDialogProps } from '../../Dialogs/DiscardDialog.constants';
import { DiscardDialog } from '../../Dialogs/DiscardDialog.component';

type Props = {
    onBackToMainPage: () => void,
    onBackToDashboard?: () => void,
    onBackToViewEvent?: () => void,
    displayFrontPageList: boolean,
    programId: string,
    userInteractionInProgress?: boolean,
    trackedEntityName?: string,
};

export const EventStatuses = {
    ACTIVE: 'ACTIVE',
    COMPLETED: 'COMPLETED',
    SKIPPED: 'SKIPPED',
    SCHEDULE: 'SCHEDULE',
    OVERDUE: 'OVERDUE',
};

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
    },
};

export const EnrollmentPageKeys = Object.freeze({
    MAIN_PAGE: 'mainPage',
    OVERVIEW: 'overview',
    NEW_EVENT: 'newEvent',
    EDIT_EVENT: 'editEvent',
    VIEW_EVENT: 'viewEvent',
});

const eventIsScheduled = eventStatus => [EventStatuses.SCHEDULE, EventStatuses.OVERDUE, EventStatuses.SKIPPED]
    .includes(eventStatus);

const BreadcrumbsPlain = ({
    onBackToMainPage,
    onBackToDashboard,
    onBackToViewEvent,
    eventStatus,
    programId,
    trackedEntityName,
    displayFrontPageList,
    userInteractionInProgress = false,
    page,
    classes,
}) => {
    const [openWarning, setOpenWarning] = useState(null);

    const { label } = useWorkingListLabel({
        trackedEntityName,
        programId,
        displayFrontPageList,
    });

    const handleNavigation = useCallback((callback, warningType) => {
        if (userInteractionInProgress) {
            setOpenWarning(warningType);
        } else {
            callback && callback();
        }
    }, [userInteractionInProgress]);

    const breadcrumbItems = useMemo(() => ([
        {
            key: 'mainPage',
            onClick: () => handleNavigation(onBackToMainPage, 'mainPage'),
            label,
            selected: page === EnrollmentPageKeys.MAIN_PAGE,
            condition: true,
        },
        {
            key: 'dashboard',
            onClick: () => handleNavigation(onBackToDashboard, 'dashboard'),
            label: i18n.t('Enrollment dashboard'),
            selected: page === EnrollmentPageKeys.OVERVIEW,
            condition: page !== EnrollmentPageKeys.MAIN_PAGE,
        },
        {
            key: 'viewEvent',
            onClick: () => {
                handleNavigation(onBackToViewEvent, 'viewEvent');
            },
            label: i18n.t('View event'),
            selected: page === EnrollmentPageKeys.VIEW_EVENT,
            condition: page === EnrollmentPageKeys.VIEW_EVENT ||
                (page === EnrollmentPageKeys.EDIT_EVENT && !eventIsScheduled(eventStatus)),
        },
        {
            key: 'editEvent',
            onClick: () => {},
            label: i18n.t('Edit event'),
            selected: page === EnrollmentPageKeys.EDIT_EVENT,
            condition: page === EnrollmentPageKeys.EDIT_EVENT,
        },
        {
            key: 'newEvent',
            onClick: () => {},
            label: i18n.t('New event'),
            selected: page === EnrollmentPageKeys.NEW_EVENT,
            condition: page === EnrollmentPageKeys.NEW_EVENT,
        },
    ].filter(item => item.condition !== false)), [
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
                    />
                    {index < (breadcrumbItems.length - 1) && (
                        <IconChevronRight16 color={colors.grey800} />
                    )}
                </React.Fragment>
            ))}

            <DiscardDialog
                open={openWarning === 'mainPage'}
                onDestroy={() => {
                    setOpenWarning(null);
                    onBackToMainPage && onBackToMainPage();
                }}
                onCancel={() => setOpenWarning(null)}
                {...defaultDialogProps}
            />

            <DiscardDialog
                open={openWarning === 'dashboard'}
                onDestroy={() => {
                    setOpenWarning(null);
                    onBackToDashboard && onBackToDashboard();
                }}
                onCancel={() => setOpenWarning(null)}
                {...defaultDialogProps}
            />

            <DiscardDialog
                open={openWarning === 'viewEvent'}
                onDestroy={() => {
                    setOpenWarning(null);
                    onBackToViewEvent && onBackToViewEvent();
                }}
                onCancel={() => setOpenWarning(null)}
                {...defaultDialogProps}
            />
        </div>
    );
};

export const EnrollmentBreadcrumb: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(BreadcrumbsPlain);
