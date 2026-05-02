import React, { useState } from 'react';
import { FlyoutMenu, IconMore16, MenuItem } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import type { PlainProps } from './OverflowMenu.types';
import { DeleteMenuItem, DeleteModal } from './Delete';
import { StatusToggleMenuItem, StatusToggleModal } from './StatusToggle';
import { OverflowButton } from '../../Buttons';
import { TrackedEntityChangelogWrapper } from './TrackedEntityChangelogWrapper';

export const OverflowMenuComponent = ({
    trackedEntity,
    trackedEntityData,
    trackedEntityTypeName,
    readOnly,
    canCascadeDeleteTei,
    isInactive,
    onDeleteSuccess,
    onStatusToggleSuccess,
    displayChangelog,
    teiId,
    programAPI,
    readOnlyMode,
}: PlainProps) => {
    const [actionsIsOpen, setActionsIsOpen] = useState(false);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [statusToggleModalIsOpen, setStatusToggleModalIsOpen] = useState(false);
    const [changelogIsOpen, setChangelogIsOpen] = useState(false);

    if (readOnlyMode && !displayChangelog && !isInactive) {
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
                    <FlyoutMenu
                        dense
                        maxWidth="250px"
                        dataTest={'tracked-entity-profile-overflow-menu'}
                    >
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
                        {(!readOnlyMode || isInactive) && (
                            <>
                                <StatusToggleMenuItem
                                    trackedEntityTypeName={trackedEntityTypeName}
                                    isInactive={isInactive}
                                    readOnly={readOnly}
                                    setActionsIsOpen={setActionsIsOpen}
                                    setStatusToggleModalIsOpen={setStatusToggleModalIsOpen}
                                />
                                <DeleteMenuItem
                                    trackedEntityTypeName={trackedEntityTypeName}
                                    readOnly={readOnly}
                                    canCascadeDeleteTei={canCascadeDeleteTei}
                                    setActionsIsOpen={setActionsIsOpen}
                                    setDeleteModalIsOpen={setDeleteModalIsOpen}
                                />
                            </>
                        )}
                    </FlyoutMenu>
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
            {statusToggleModalIsOpen && (
                <StatusToggleModal
                    trackedEntityTypeName={trackedEntityTypeName}
                    trackedEntity={trackedEntity}
                    isInactive={isInactive}
                    setOpenModal={setStatusToggleModalIsOpen}
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
