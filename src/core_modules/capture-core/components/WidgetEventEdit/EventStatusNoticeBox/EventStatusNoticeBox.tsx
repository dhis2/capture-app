import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconInfo16, Tag } from '@dhis2/ui';
import { statusTypes as eventStatuses } from 'capture-core/events/statusTypes';
import { ConditionalTooltip } from '../../Tooltips/ConditionalTooltip';

type Props = {
    eventStatus?: string;
    isEventExpired: boolean;
    isEventBlockedByExpiry: boolean;
    isCompletedAndBlockingForm: boolean;
    isEventBlockedByCompletion: boolean;
    canEditProgramStage: boolean;
};

type Notice = { label: string; tooltip: string };

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
            label: i18n.t('Skipped'),
            tooltip: i18n.t('You can unskip this event to edit it.'),
        };
    }
    if (isCompletedAndBlockingForm && !isEventBlockedByCompletion) {
        return {
            label: i18n.t('Completed'),
            tooltip: i18n.t('You can mark this event as incomplete to edit it.'),
        };
    }
    if (isEventExpired && !isEventBlockedByExpiry) {
        return {
            label: i18n.t('Outside editing period'),
            tooltip: i18n.t('You have permission to edit expired events.'),
        };
    }
    return undefined;
};

export const EventStatusNoticeBox = ({
    eventStatus,
    isEventExpired,
    isEventBlockedByExpiry,
    isCompletedAndBlockingForm,
    isEventBlockedByCompletion,
    canEditProgramStage,
}: Props) => {
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
        <ConditionalTooltip content={notice.tooltip} enabled>
            <Tag neutral icon={<IconInfo16 />} dataTest="event-status-notice-box">
                {notice.label}
            </Tag>
        </ConditionalTooltip>
    );
};
