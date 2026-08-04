import React, { useState } from 'react';
import { CircularLoader, FlyoutMenu, IconMore16 } from '@dhis2/ui';
import { OverflowButton } from '../Buttons';
import {
    SkipMenuItem,
    DeleteMenuItem,
    DeleteEventModal,
    ChangelogMenuItem,
    CompletionMenuItem,
} from './MenuItems';
import { useEventMenu } from './useEventMenu';
import type { Props } from './EventOverflowMenu.types';

export const EventOverflowMenu = (props: Props) => {
    const {
        eventId,
        eventStatus,
        pendingApiResponse,
        eventDetailsForRollback,
        onCompletionStatusMutate,
        onCompletionStatusUpdated,
        onCompletionStatusError,
        onStatusMutate,
        onStatusError,
        onStatusUpdated,
        onOptimisticDelete,
        onDeleteSuccess,
        onDeleteError,
        onOpenChangelog,
        dataTest = 'event-overflow-menu',
    } = props;

    const [actionsOpen, setActionsOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const { visibility, deleteItemProps } = useEventMenu(props);

    if (!visibility.any) {
        return null;
    }

    const close = () => setActionsOpen(false);

    return (
        <>
            {pendingApiResponse ? (
                <CircularLoader small dataTest={`${dataTest}-saving-loader`} />
            ) : (
                <OverflowButton
                    open={actionsOpen}
                    onClick={() => setActionsOpen(prev => !prev)}
                    secondary
                    small
                    icon={<IconMore16 />}
                    dataTest={`${dataTest}-button`}
                    component={(
                        <FlyoutMenu dense maxWidth="250px" dataTest={dataTest}>
                            {visibility.completion && onCompletionStatusUpdated && (
                                <CompletionMenuItem
                                    eventId={eventId}
                                    eventStatus={eventStatus}
                                    onMutate={onCompletionStatusMutate}
                                    onSuccess={onCompletionStatusUpdated}
                                    onError={onCompletionStatusError}
                                    onClose={close}
                                />
                            )}
                            {visibility.skip && (
                                <SkipMenuItem
                                    eventId={eventId}
                                    eventStatus={eventStatus}
                                    onClose={close}
                                    onStatusMutate={onStatusMutate}
                                    onStatusError={onStatusError}
                                    onStatusUpdated={onStatusUpdated}
                                />
                            )}
                            {visibility.changelog && onOpenChangelog && (
                                <ChangelogMenuItem
                                    onClose={close}
                                    onOpenChangelog={onOpenChangelog}
                                />
                            )}
                            {visibility.delete && (
                                <DeleteMenuItem
                                    {...deleteItemProps}
                                    onClose={close}
                                    onRequestDelete={() => setDeleteConfirmOpen(true)}
                                />
                            )}
                        </FlyoutMenu>
                    )}
                />
            )}
            {deleteConfirmOpen && (
                <DeleteEventModal
                    eventId={eventId}
                    eventDetailsForRollback={eventDetailsForRollback}
                    onClose={() => setDeleteConfirmOpen(false)}
                    onOptimisticDelete={onOptimisticDelete}
                    onDeleteSuccess={onDeleteSuccess}
                    onDeleteError={onDeleteError}
                />
            )}
        </>
    );
};
