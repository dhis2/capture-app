// @flow
import React, { useState } from 'react';
import type { ComponentType } from 'react';
import { FlyoutMenu, IconMore16, spacers } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import type { PlainProps } from './OverflowMenu.types';
import { DeleteMenuItem, DeleteModal } from './Delete';
import { OverflowButton } from '../../Buttons';

const styles = {
    iconButton: {
        display: 'flex',
        marginLeft: spacers.dp4,
    },
};

const MenuPlain = ({
    trackedEntity,
    trackedEntityTypeName,
    canWriteData,
    canCascadeDeleteTei,
    onDeleteSuccess,
    classes,
}: PlainProps) => {
    const [actionsIsOpen, setActionsIsOpen] = useState(false);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    // const [changelogIsOpen, setChangelogIsOpen] = useState(false);

    return (
        <>
            <OverflowButton
                open={actionsIsOpen}
                onClick={() => setActionsIsOpen(prev => !prev)}
                icon={<IconMore16 />}
                small
                secondary
                className={classes.iconButton}
                dataTest="widget-profile-overflow-menu"
                component={
                    <FlyoutMenu dense>
                        {/* To enable in DHIS2-16764
                        <MenuItem
                            label={i18n.t('View changelog')}
                            onClick={() => {
                                setChangelogIsOpen(true);
                                setActionsIsOpen(false);
                            }}
                        />
                        <MenuDivider dense /> */}
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
            {/* {changelogIsOpen && supportsChangelog && <> DHIS2-16764 </>} */}
        </>
    );
};

export const OverflowMenuComponet: ComponentType<$Diff<PlainProps, CssClasses>> = withStyles(styles)(MenuPlain);
