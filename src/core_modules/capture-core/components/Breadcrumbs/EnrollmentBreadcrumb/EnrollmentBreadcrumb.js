// @flow
import React, { useCallback, useMemo, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { colors, IconChevronRight16 } from '@dhis2/ui';
import { useWorkingListLabel } from './hooks/useWorkingListLabel';
import { BreadcrumbItem } from '../common/BreadcrumbItem';
import { defaultDialogProps } from '../../Dialogs/DiscardDialog.constants';
import { DiscardDialog } from '../../Dialogs/DiscardDialog.component';
import {
    EnrollmentPageKeys,
} from '../../Pages/common/EnrollmentOverviewDomain/EnrollmentPageLayout/DefaultEnrollmentLayout.constants';

type Props = {
    onBackToMainPage: () => void,
    onBackToDashboard?: () => void,
    onBackToViewEvent?: () => void,
    displayFrontPageList: boolean,
    programId: string,
    userInteractionInProgress?: boolean,
    trackedEntityName?: string,
    eventStatus?: string,
    page?: string,
};

export const EventStatuses = {
    ACTIVE: 'ACTIVE',
    COMPLETED: 'COMPLETED',
    SKIPPED: 'SKIPPED',
    SCHEDULE: 'SCHEDULE',
    OVERDUE: 'OVERDUE',
};

const pageKeys = Object.freeze({
    MAIN_PAGE: 'mainPage',
    ...EnrollmentPageKeys,
});

const eventIsScheduled = eventStatus => [EventStatuses.SCHEDULE, EventStatuses.OVERDUE, EventStatuses.SKIPPED]
    .includes(eventStatus);

export const EnrollmentBreadcrumb = ({
    onBackToMainPage,
    onBackToDashboard,
    onBackToViewEvent,
    eventStatus,
    programId,
    trackedEntityName,
    displayFrontPageList,
    userInteractionInProgress = false,
    page,
}: Props) => {
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
            onClick: () => {},
            label: i18n.t('Edit event'),
            selected: page === pageKeys.EDIT_EVENT,
            condition: page === pageKeys.EDIT_EVENT,
        },
        {
            key: pageKeys.NEW_EVENT,
            onClick: () => {},
            label: i18n.t('New event'),
            selected: page === pageKeys.NEW_EVENT,
            condition: page === pageKeys.NEW_EVENT,
        },
    ].filter(item => item.condition)), [
        label,
        page,
        eventStatus,
        handleNavigation,
        onBackToMainPage,
        onBackToDashboard,
        onBackToViewEvent,
    ]);

    return (
        <div className="container">
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
                    onBackToMainPage && onBackToMainPage();
                }}
                onCancel={() => setOpenWarning(null)}
                {...defaultDialogProps}
            />

            <DiscardDialog
                open={openWarning === pageKeys.OVERVIEW}
                onDestroy={() => {
                    setOpenWarning(null);
                    onBackToDashboard && onBackToDashboard();
                }}
                onCancel={() => setOpenWarning(null)}
                {...defaultDialogProps}
            />

            <DiscardDialog
                open={openWarning === pageKeys.VIEW_EVENT}
                onDestroy={() => {
                    setOpenWarning(null);
                    onBackToViewEvent && onBackToViewEvent();
                }}
                onCancel={() => setOpenWarning(null)}
                {...defaultDialogProps}
            />

            <style jsx>{`
                .container {
                    display: flex;
                    align-items: center;
                }
            `}</style>
        </div>
    );
};

