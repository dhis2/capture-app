import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { NoticeBox, spacers } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { statusTypes as eventStatuses } from 'capture-core/events/statusTypes';

const styles = {
    wrapper: {
        padding: spacers.dp8,
        // Zero out NoticeBox's default bottom margin; wrapper padding is enough.
        '& > *': {
            marginBottom: 0,
        },
    },
} as const;

type Props = {
    eventStatus?: string;
    isEventExpired: boolean;
    isEventBlockedByExpiry: boolean;
    isCompletedAndBlockingForm: boolean;
    isEventBlockedByCompletion: boolean;
    canEditProgramStage: boolean;
};

type Notice = { title: string; message: string };

const getNotice = ({
    eventStatus,
    isEventExpired,
    isEventBlockedByExpiry,
    isCompletedAndBlockingForm,
    isEventBlockedByCompletion,
    canEditProgramStage,
}: Props): Notice | undefined => {
    if (eventStatus === eventStatuses.SKIPPED && canEditProgramStage) {
        return {
            title: i18n.t('This event is skipped'),
            message: i18n.t('You can unskip this event to edit it.'),
        };
    }
    if (isCompletedAndBlockingForm && !isEventBlockedByCompletion) {
        return {
            title: i18n.t('This event is completed'),
            message: i18n.t('You can mark this event as incomplete to edit it.'),
        };
    }
    if (isEventExpired && !isEventBlockedByExpiry) {
        return {
            title: i18n.t('This event is outside the editing period'),
            message: i18n.t('You have permission to edit expired events.'),
        };
    }
    return undefined;
};

const EventStatusNoticeBoxPlain = ({
    eventStatus,
    isEventExpired,
    isEventBlockedByExpiry,
    isCompletedAndBlockingForm,
    isEventBlockedByCompletion,
    canEditProgramStage,
    classes,
}: Props & WithStyles<typeof styles>) => {
    const notice = getNotice({
        eventStatus,
        isEventExpired,
        isEventBlockedByExpiry,
        isCompletedAndBlockingForm,
        isEventBlockedByCompletion,
        canEditProgramStage,
    });
    if (!notice) return null;
    return (
        <div className={classes.wrapper}>
            <NoticeBox title={notice.title} dataTest="event-status-notice-box">
                {notice.message}
            </NoticeBox>
        </div>
    );
};

export const EventStatusNoticeBox = withStyles(styles)(EventStatusNoticeBoxPlain);
