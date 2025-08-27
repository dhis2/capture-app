import React, { useState } from 'react';
import { FlyoutMenu, IconMore16, MenuItem } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import type { PlainProps } from './OverflowMenu.types';
import { DeleteMenuItem, DeleteModal } from './Delete';
import { OverflowButton } from '../../Buttons';
import { TrackedEntityChangelogWrapper } from './TrackedEntityChangelogWrapper';

export const OverflowMenuComponent = ({
    trackedEntity,
    trackedEntityData,
    trackedEntityTypeName,
    canWriteData,
    canCascadeDeleteTei,
    onDeleteSuccess,
    displayChangelog,
    teiId,
    programAPI,
    readOnlyMode,
}: PlainProps) => {
    const [actionsIsOpen, setActionsIsOpen] = useState(false);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [changelogIsOpen, setChangelogIsOpen] = useState(false);

    if (readOnlyMode && !displayChangelog) {
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
                    <FlyoutMenu dense>
                        {displayChangelog && (
                            <MenuItem
                                label={i18n.t('View changelog')}
                                data-test="tracked-entity-profile-changelog"
                                onClick={() => {
                                    setChangelogIsOpen(true);
                                    setActionsIsOpen(false);
                                }}
                                suffix={null}
                            />
                        )}
                        {!readOnlyMode && (
                            <DeleteMenuItem
                                trackedEntityTypeName={trackedEntityTypeName}
                                canWriteData={canWriteData}
                                canCascadeDeleteTei={canCascadeDeleteTei}
                                setActionsIsOpen={setActionsIsOpen}
                                setDeleteModalIsOpen={setDeleteModalIsOpen}
                            />
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
