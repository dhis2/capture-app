// @flow
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FlyoutMenu, IconDelete16, IconLink16, IconMore16, IconView16, Divider, MenuItem } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { OverflowButton } from '../../Buttons';
import { UnlinkModal, UnlinkAndDeleteModal } from './Modal';
import { buildUrlQueryString } from '../../../utils/routing';


type Props = {
    linkedEvent: any,
    orgUnitId: string,
};

export const OverflowMenuComponent = ({
    linkedEvent,
    orgUnitId,
}: Props) => {
    const [actionsIsOpen, setActionsIsOpen] = useState(false);
    const [unlikModalIsOpen, setUnlinkModalIsOpen] = useState(false);
    const [UnlinkAndDeleteModalIsOpen, setUnlinkAndDeleteModalIsOpen] = useState(false);

    const { push } = useHistory();

    return (
        <>
            <OverflowButton
                open={actionsIsOpen}
                onClick={() => setActionsIsOpen(prev => !prev)}
                icon={<IconMore16 />}
                small
                secondary
                dataTest={'widget-event-navigate-to-linked-event'}
                component={(
                    <FlyoutMenu dense maxWidth="250px">
                        <MenuItem
                            label={i18n.t('View linked event')}
                            icon={<IconView16 />}
                            dataTest={'event-overflow-view-linked-event'}
                            onClick={() => {
                                push(`/enrollmentEventEdit?${buildUrlQueryString({
                                    eventId: linkedEvent.event,
                                    orgUnitId,
                                })}`);
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
                            }}
                        />
                        <MenuItem
                            destructive
                            dense
                            icon={<IconDelete16 />}
                            label={i18n.t('Unlink and delete event')}
                            onClick={() => {
                                setUnlinkAndDeleteModalIsOpen(true);
                            }}
                        />

                    </FlyoutMenu>
                )}
            />
            {unlikModalIsOpen && (
                <UnlinkModal
                    setOpenModal={setUnlinkModalIsOpen}
                />
            )}
            {UnlinkAndDeleteModalIsOpen && (
                <UnlinkAndDeleteModal
                    setOpenModal={setUnlinkAndDeleteModalIsOpen}
                />
            )}
        </>
    );
};
