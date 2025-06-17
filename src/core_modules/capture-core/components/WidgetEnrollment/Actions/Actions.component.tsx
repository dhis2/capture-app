import { DropdownButton, FlyoutMenu, MenuDivider, spacersNum, colors } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from '@material-ui/core';
import React, { type ComponentType, useState } from 'react';
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

const styles: Readonly<any> = {
    actions: {
        margin: `${spacersNum.dp8}px 0 0 0`,
    },
    loading: {
        display: 'flex',
        alignItems: 'center',
        margin: `${spacersNum.dp8}px 0 0 0`,
        fontSize: '14px',
        color: colors.grey900,
    },
};

export const ActionsPlain = ({
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
    classes,
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
                className={classes.actions}
                open={isOpenActions}
                onClick={() => setOpenActions(prev => !prev)}
                component={
                    loading ? undefined : (
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
                <div className={classes.loading}>
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
                    enrollment={{ ...enrollment, program: enrollment.program || '' }}
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
        </>
    );
};

type OwnProps = Omit<PlainProps, keyof WithStyles<any>>;
export const ActionsComponent = withStyles(styles)(ActionsPlain) as ComponentType<OwnProps>;
