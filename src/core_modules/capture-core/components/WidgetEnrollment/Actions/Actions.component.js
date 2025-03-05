// @flow
import { DropdownButton, FlyoutMenu, MenuDivider, spacersNum, colors } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import React, { useState } from 'react';
import { Cancel } from './Cancel';
import { Complete, CompleteModal } from './Complete';
import { Delete } from './Delete';
import { Followup } from './Followup';
import { AddNew } from './AddNew';
import { AddLocation } from './AddLocation';
import type { PlainProps } from './actions.types';
import { LoadingMaskForButton } from '../../LoadingMasks';
import { MapModal } from '../MapModal';
import { Transfer } from './Transfer';
import { TransferModal } from '../TransferModal';

export const ActionsComponent = ({
    enrollment = {},
    events,
    programStages,
    ownerOrgUnitId,
    tetName,
    canAddNew,
    onUpdateStatus,
    onUpdate,
    onDelete,
    onUpdateOwnership,
    canCascadeDeleteEnrollment,
    isTransferLoading,
    onAddNew,
    loading,
    onlyEnrollOnce,
}: PlainProps) => {
    const [isOpenActions, setOpenActions] = useState(false);
    const [isOpenMap, setOpenMap] = useState(false);
    const [isOpenTransfer, setOpenTransfer] = useState(false);
    const [isOpenCompleteModal, setOpenCompleteModal] = useState(false);

    const handleOnUpdate = (arg) => {
        setOpenActions(false);
        onUpdate(arg);
    };
    const handleOnDelete = (arg) => {
        setOpenActions(false);
        onDelete(arg);
    };
    const handleOnUpdateStatus = (arg, redirect) => {
        setOpenActions(false);
        onUpdateStatus(arg, redirect);
    };

    return (
        <>
            <DropdownButton
                dataTest="widget-enrollment-actions-button"
                secondary
                small
                disabled={loading}
                className="actions"
                open={isOpenActions}
                onClick={() => setOpenActions(prev => !prev)}
                component={
                    loading ? null : (
                        <FlyoutMenu dense maxWidth="250px">
                            <AddNew
                                onlyEnrollOnce={onlyEnrollOnce}
                                tetName={tetName}
                                canAddNew={canAddNew}
                                onAddNew={onAddNew}
                            />
                            <Complete
                                enrollment={enrollment}
                                events={events}
                                onUpdate={handleOnUpdateStatus}
                                setOpenCompleteModal={(modalState) => {
                                    setOpenCompleteModal(modalState);
                                    setOpenActions(!modalState);
                                }}
                            />
                            <Followup
                                enrollment={enrollment}
                                onUpdate={handleOnUpdate}
                            />
                            <Transfer
                                enrollment={enrollment}
                                setOpenTransfer={() => {
                                    setOpenTransfer(true);
                                    setOpenActions(false);
                                }}
                            />
                            <AddLocation
                                enrollment={enrollment}
                                setOpenMap={() => {
                                    setOpenMap(true);
                                    setOpenActions(false);
                                }}
                            />
                            <MenuDivider />
                            <Cancel
                                enrollment={enrollment}
                                onUpdate={handleOnUpdateStatus}
                            />
                            <Delete
                                canCascadeDeleteEnrollment={canCascadeDeleteEnrollment}
                                enrollment={enrollment}
                                onDelete={handleOnDelete}
                            />

                        </FlyoutMenu>
                    )
                }
            >
                {i18n.t('Enrollment actions')}
            </DropdownButton>
            {loading && (
                <div className="loading">
                    <LoadingMaskForButton />
                    &nbsp;
                    {i18n.t('We are processing your request.')}
                </div>
            )}
            {isOpenMap && <MapModal
                enrollment={enrollment}
                onUpdate={handleOnUpdate}
                setOpenMap={setOpenMap}
            />}
            {isOpenTransfer && (
                <TransferModal
                    enrollment={enrollment}
                    ownerOrgUnitId={ownerOrgUnitId}
                    setOpenTransfer={setOpenTransfer}
                    onUpdateOwnership={onUpdateOwnership}
                    isTransferLoading={isTransferLoading}
                />
            )}
            {isOpenCompleteModal && (
                <CompleteModal
                    enrollment={enrollment}
                    events={events}
                    programStages={programStages}
                    setOpenCompleteModal={setOpenCompleteModal}
                    onUpdateStatus={handleOnUpdateStatus}
                />
            )}
            <style jsx>{`
                .actions {
                    margin: ${spacersNum.dp8}px 0 0 0;
                }
                .loading {
                    display: flex;
                    align-items: center;
                    margin: ${spacersNum.dp8}px 0 0 0;
                    font-size: 14px;
                    color: ${colors.grey900};
                }
            `}</style>
        </>
    );
};
