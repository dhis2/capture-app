// @flow
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
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
import { OverflowButton } from '../../Buttons';
import { UnlinkModal, UnlinkAndDeleteModal } from './Modal';
import { buildUrlQueryString } from '../../../utils/routing';
import type { Props } from './OverflowMenu.types';

export const OverflowMenuComponent = ({
    linkedEvent,
    relationshipId,
    orgUnitId,
    setUpdateData,
}: Props) => {
    const { push } = useHistory();

    const [actionsIsOpen, setActionsIsOpen] = useState(false);
    const [unlinkModalIsOpen, setUnlinkModalIsOpen] = useState(false);
    const [unlinkAndDeleteModalIsOpen, setUnlinkAndDeleteModalIsOpen] = useState(false);

    return (
        <>
            <OverflowButton
                open={actionsIsOpen}
                onClick={() => setActionsIsOpen(prev => !prev)}
                icon={<IconMore16 />}
                small
                secondary
                dataTest={'widget-linked-event-overflow-menu'}
                component={
                    <FlyoutMenu dense maxWidth="250px">
                        <MenuItem
                            label={i18n.t('View linked event')}
                            icon={<IconView16 />}
                            dataTest={'event-overflow-view-linked-event'}
                            onClick={() => {
                                push(
                                    `/enrollmentEventEdit?${buildUrlQueryString({
                                        eventId: linkedEvent.event,
                                        orgUnitId,
                                    })}`,
                                );
                                setActionsIsOpen(false);
                            }}
                        />
                        <Divider />
                        <MenuItem
                            label={i18n.t('Unlink event')}
                            icon={<IconLink16 />}
                            dataTest={'event-overflow-unlink-event'}
                            onClick={() => {
                                setUnlinkModalIsOpen(true);
                                setActionsIsOpen(false);
                            }}
                        />
                        <MenuItem
                            label={i18n.t('Unlink and delete event')}
                            icon={<IconDelete16 />}
                            dataTest={'event-overflow-unlink-and-delete-event'}
                            destructive
                            onClick={() => {
                                setUnlinkAndDeleteModalIsOpen(true);
                                setActionsIsOpen(false);
                            }}
                        />
                    </FlyoutMenu>
                }
            />
            {unlinkModalIsOpen && (
                <UnlinkModal
                    setOpenModal={setUnlinkModalIsOpen}
                    relationshipId={relationshipId}
                    setUpdateData={setUpdateData}
                />
            )}
            {unlinkAndDeleteModalIsOpen && (
                <UnlinkAndDeleteModal
                    setOpenModal={setUnlinkAndDeleteModalIsOpen}
                    eventId={linkedEvent.event}
                    setUpdateData={setUpdateData}
                />
            )}
        </>
    );
};
