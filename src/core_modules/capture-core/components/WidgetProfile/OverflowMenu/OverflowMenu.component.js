// @flow
import React, { useState } from 'react';
import { FlyoutMenu, IconMore16, MenuItem, MenuDivider } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import type { PlainProps } from './OverflowMenu.types';
import { DeleteMenuItem, DeleteModal } from './Delete';
import { OverflowButton } from '../../Buttons';
import { TrackedEntityChangelogWrapper } from './TrackedEntityChangelogWrapper';

export const OverflowMenuComponent = ({
    trackedEntity,
    trackedEntityTypeName,
    canWriteData,
    canCascadeDeleteTei,
    onDeleteSuccess,
    displayChangelog,
    teiId,
    programAPI,
}: PlainProps) => {
    const [actionsIsOpen, setActionsIsOpen] = useState(false);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [changelogIsOpen, setChangelogIsOpen] = useState(false);

    return (
        <>
            <OverflowButton
                open={actionsIsOpen}
                onClick={() => setActionsIsOpen(prev => !prev)}
                icon={<IconMore16 />}
                small
                secondary
                dataTest="widget-profile-overflow-menu"
                component={
                    <FlyoutMenu dense>
                        {displayChangelog && (
                            <>
                                <MenuItem
                                    label={i18n.t('View changelog')}
                                    onClick={() => {
                                        setChangelogIsOpen(true);
                                        setActionsIsOpen(false);
                                    }}
                                />
                                <MenuDivider dense />
                            </>
                        )}
                        <DeleteMenuItem
                            trackedEntityTypeName={trackedEntityTypeName}
                            canWriteData={canWriteData}
                            canCascadeDeleteTei={canCascadeDeleteTei}
                            setActionsIsOpen={setActionsIsOpen}
                            setDeleteModalIsOpen={setDeleteModalIsOpen}
                        />
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
            {changelogIsOpen && (
                <TrackedEntityChangelogWrapper
                    teiId={teiId}
                    programAPI={programAPI}
                    isOpen={changelogIsOpen}
                    setIsOpen={setChangelogIsOpen}
                />
            )}
        </>
    );
};
