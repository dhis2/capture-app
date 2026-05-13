import React, { useState } from 'react';
import { FlyoutMenu, IconMore16, MenuItem } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import type { PlainProps } from './OverflowMenu.types';
import { DeleteMenuItem, DeleteModal } from './Delete';
import { DeactivateMenuItem, DeactivateModal } from './Deactivate';
import { OverflowButton } from '../../Buttons';
import { TrackedEntityChangelogWrapper } from './TrackedEntityChangelogWrapper';

type MenuFlyoutProps = {
    displayChangelog: boolean;
    canShowDeactivate: boolean;
    canShowDelete: boolean;
    trackedEntityTypeName: string;
    trackedEntityInactive: boolean;
    canWriteData: boolean;
    canCascadeDeleteTei: boolean;
    setActionsIsOpen: (open: boolean) => void;
    setChangelogIsOpen: (open: boolean) => void;
    setDeactivateModalIsOpen: (open: boolean) => void;
    setDeleteModalIsOpen: (open: boolean) => void;
};

const MenuFlyout = ({
    displayChangelog,
    canShowDeactivate,
    canShowDelete,
    trackedEntityTypeName,
    trackedEntityInactive,
    canWriteData,
    canCascadeDeleteTei,
    setActionsIsOpen,
    setChangelogIsOpen,
    setDeactivateModalIsOpen,
    setDeleteModalIsOpen,
}: MenuFlyoutProps) => (
    <FlyoutMenu dense maxWidth="250px" dataTest="tracked-entity-profile-overflow-menu">
        {displayChangelog && (
            <MenuItem
                label={i18n.t('View changelog')}
                onClick={() => {
                    setChangelogIsOpen(true);
                    setActionsIsOpen(false);
                }}
                suffix={null}
            />
        )}
        {canShowDeactivate && (
            <DeactivateMenuItem
                trackedEntityTypeName={trackedEntityTypeName}
                trackedEntityInactive={trackedEntityInactive}
                setActionsIsOpen={setActionsIsOpen}
                setDeactivateModalIsOpen={setDeactivateModalIsOpen}
            />
        )}
        {canShowDelete && (
            <DeleteMenuItem
                trackedEntityTypeName={trackedEntityTypeName}
                canWriteData={canWriteData}
                canCascadeDeleteTei={canCascadeDeleteTei}
                setActionsIsOpen={setActionsIsOpen}
                setDeleteModalIsOpen={setDeleteModalIsOpen}
            />
        )}
    </FlyoutMenu>
);

export const OverflowMenuComponent = ({
    trackedEntity,
    trackedEntityForToggle,
    trackedEntityData,
    trackedEntityTypeName,
    canWriteData,
    canCascadeDeleteTei,
    canToggleStatus,
    trackedEntityInactive,
    onDeleteSuccess,
    onStatusToggleSuccess,
    displayChangelog,
    teiId,
    programAPI,
    readOnlyMode,
}: PlainProps) => {
    const [actionsIsOpen, setActionsIsOpen] = useState(false);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [deactivateModalIsOpen, setDeactivateModalIsOpen] = useState(false);
    const [changelogIsOpen, setChangelogIsOpen] = useState(false);

    const canShowDeactivate = canToggleStatus && Boolean(trackedEntityForToggle);
    const canShowDelete = !readOnlyMode && canWriteData;

    if (!displayChangelog && !canShowDeactivate && !canShowDelete) {
        return null;
    }

    return (
        <>
            <OverflowButton
                open={actionsIsOpen}
                onClick={() => setActionsIsOpen(prev => !prev)}
                icon={<IconMore16 />}
                small
                secondary
                dataTest="tracked-entity-profile-overflow-button"
                component={
                    <MenuFlyout
                        displayChangelog={displayChangelog}
                        canShowDeactivate={canShowDeactivate}
                        canShowDelete={canShowDelete}
                        trackedEntityTypeName={trackedEntityTypeName}
                        trackedEntityInactive={trackedEntityInactive}
                        canWriteData={canWriteData}
                        canCascadeDeleteTei={canCascadeDeleteTei}
                        setActionsIsOpen={setActionsIsOpen}
                        setChangelogIsOpen={setChangelogIsOpen}
                        setDeactivateModalIsOpen={setDeactivateModalIsOpen}
                        setDeleteModalIsOpen={setDeleteModalIsOpen}
                    />
                }
            />
            {deleteModalIsOpen && (
                <DeleteModal
                    trackedEntityTypeName={trackedEntityTypeName}
                    trackedEntity={trackedEntity}
                    setOpenModal={setDeleteModalIsOpen}
                    onDeleteSuccess={onDeleteSuccess}
                />
            )}
            {deactivateModalIsOpen && trackedEntityForToggle && (
                <DeactivateModal
                    trackedEntityTypeName={trackedEntityTypeName}
                    trackedEntity={trackedEntityForToggle}
                    trackedEntityInactive={trackedEntityInactive}
                    setOpenModal={setDeactivateModalIsOpen}
                    onStatusToggleSuccess={onStatusToggleSuccess}
                />
            )}
            {changelogIsOpen && (
                <TrackedEntityChangelogWrapper
                    teiId={teiId}
                    programAPI={programAPI}
                    isOpen={changelogIsOpen}
                    setIsOpen={setChangelogIsOpen}
                    trackedEntityData={trackedEntityData}
                />
            )}
        </>
    );
};
