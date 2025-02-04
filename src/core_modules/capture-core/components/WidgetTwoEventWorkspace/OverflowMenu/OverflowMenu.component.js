// @flow
import React, { useState } from 'react';
import {
    Divider,
    FlyoutMenu,
    IconDelete16,
    IconLink16,
    IconMore16,
    IconView16,
    MenuItem,
} from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { ConditionalTooltip } from '../../Tooltips/ConditionalTooltip';
import { OverflowButton } from '../../Buttons';
import { UnlinkModal, UnlinkAndDeleteModal } from './Modal';
import { useNavigate, buildUrlQueryString } from '../../../utils/routing';
import type { Props } from './OverflowMenu.types';
import { useRelationshipTypeAccess } from '../hooks';

export const OverflowMenuComponent = ({
    linkedEvent,
    relationshipId,
    orgUnitId,
    originEventId,
    stageWriteAccess,
    relationshipType,
}: Props) => {
    const { navigate } = useNavigate();
    const [isActionsOpen, setIsActionsOpen] = useState(false);
    const [isUnlinkModalOpen, setIsUnlinkModalOpen] = useState(false);
    const [isUnlinkAndDeleteModalOpen, setIsUnlinkAndDeleteModalOpen] = useState(false);
    const { relationshipTypeWriteAccess } = useRelationshipTypeAccess(relationshipType);

    const handleViewLinkedEvent = () => {
        navigate(`/enrollmentEventEdit?${buildUrlQueryString({ eventId: linkedEvent.event, orgUnitId })}`);
        setIsActionsOpen(false);
    };

    const handleUnlinkEvent = () => {
        setIsUnlinkModalOpen(true);
        setIsActionsOpen(false);
    };

    const handleUnlinkAndDeleteEvent = () => {
        setIsUnlinkAndDeleteModalOpen(true);
        setIsActionsOpen(false);
    };

    return (
        <>
            <OverflowButton
                open={isActionsOpen}
                onClick={() => setIsActionsOpen(prev => !prev)}
                icon={<IconMore16 />}
                small
                secondary
                dataTest="widget-linked-event-overflow-menu"
                component={
                    <FlyoutMenu dense maxWidth="250px">
                        <MenuItem
                            label={i18n.t('View linked event')}
                            icon={<IconView16 />}
                            dataTest="event-overflow-view-linked-event"
                            onClick={handleViewLinkedEvent}
                        />
                        <Divider />
                        <ConditionalTooltip
                            content={i18n.t('You do not have access to remove the link between these events')}
                            enabled={!relationshipTypeWriteAccess}
                        >
                            <MenuItem
                                label={i18n.t('Unlink event')}
                                icon={<IconLink16 />}
                                disabled={!relationshipTypeWriteAccess}
                                dense
                                dataTest="event-overflow-unlink-event"
                                onClick={handleUnlinkEvent}
                            />
                        </ConditionalTooltip>
                        <ConditionalTooltip
                            content={i18n.t('You do not have access to remove the link and delete the linked event')}
                            enabled={!stageWriteAccess || !relationshipTypeWriteAccess}
                        >
                            <MenuItem
                                label={i18n.t('Unlink and delete linked event')}
                                icon={<IconDelete16 />}
                                disabled={!stageWriteAccess || !relationshipTypeWriteAccess}
                                dense
                                destructive
                                dataTest="event-overflow-unlink-and-delete-event"
                                onClick={handleUnlinkAndDeleteEvent}
                            />
                        </ConditionalTooltip>
                    </FlyoutMenu>
                }
            />
            {isUnlinkModalOpen && (
                <UnlinkModal
                    setOpenModal={setIsUnlinkModalOpen}
                    relationshipId={relationshipId}
                    originEventId={originEventId}
                />
            )}
            {isUnlinkAndDeleteModalOpen && (
                <UnlinkAndDeleteModal
                    setOpenModal={setIsUnlinkAndDeleteModalOpen}
                    eventId={linkedEvent.event}
                    originEventId={originEventId}
                />
            )}
        </>
    );
};
