import React from 'react';
import { FlyoutMenu, MenuDivider } from '@dhis2/ui';
import { statusTypes as eventStatuses } from 'capture-core/events/statusTypes';
import { ChangelogMenuItem, SkipMenuItem, CompletionMenuItem, DeleteMenuItem } from './MenuItems';

const isSkippableStatus = (status?: string) =>
    status === eventStatuses.SCHEDULE || status === eventStatuses.SKIPPED;

const isCompletableStatus = (status?: string) =>
    status === eventStatuses.ACTIVE || status === eventStatuses.COMPLETED;

type Props = {
    eventId: string;
    eventStatus?: string;
    maxWidth?: string;
    dataTest?: string;

    onOpenChangelog: () => void;
    onClose: () => void;

    hideMutationActions?: boolean;
    canMutateEvent: boolean;
    canUncompleteEvent: boolean;
    readOnlyMessage: string;

    onSkipMutate: (newStatus: string) => void;
    onSkipSuccess: (newStatus: string) => void;
    onSkipError: () => void;

    onCompletionMutate: (newStatus: string) => void;
    onCompletionSuccess: (newStatus: string) => void;
    onCompletionError: () => void;

    onDeleteRequest: () => void;
};

export const EventOverflowMenu = ({
    eventId,
    eventStatus,
    maxWidth,
    dataTest = 'overflow-menu',
    onOpenChangelog,
    onClose,
    hideMutationActions = false,
    canMutateEvent,
    canUncompleteEvent,
    readOnlyMessage,
    onSkipMutate,
    onSkipSuccess,
    onSkipError,
    onCompletionMutate,
    onCompletionSuccess,
    onCompletionError,
    onDeleteRequest,
}: Props) => (
    <FlyoutMenu dense maxWidth={maxWidth} dataTest={dataTest}>
        <ChangelogMenuItem onOpenChangelog={onOpenChangelog} onClose={onClose} />

        {!hideMutationActions && (
            <>
                <MenuDivider />

                {isSkippableStatus(eventStatus) && (
                    <SkipMenuItem
                        eventId={eventId}
                        eventStatus={eventStatus}
                        onMutate={onSkipMutate}
                        onSuccess={onSkipSuccess}
                        onError={onSkipError}
                        onClose={onClose}
                        canMutateEvent={canMutateEvent}
                        readOnlyMessage={readOnlyMessage}
                    />
                )}

                {isCompletableStatus(eventStatus) && (
                    <CompletionMenuItem
                        eventId={eventId}
                        eventStatus={eventStatus}
                        onMutate={onCompletionMutate}
                        onSuccess={onCompletionSuccess}
                        onError={onCompletionError}
                        onClose={onClose}
                        canUncompleteEvent={canUncompleteEvent}
                        readOnlyMessage={readOnlyMessage}
                    />
                )}

                <DeleteMenuItem
                    onDeleteRequest={onDeleteRequest}
                    onClose={onClose}
                    canMutateEvent={canMutateEvent}
                    readOnlyMessage={readOnlyMessage}
                />
            </>
        )}
    </FlyoutMenu>
);
