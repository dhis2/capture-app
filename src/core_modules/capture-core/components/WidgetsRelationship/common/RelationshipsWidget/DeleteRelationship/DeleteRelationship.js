// @flow

import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import {
    DataTableCell,
    IconDelete16,
    Modal,
    ModalContent,
    ModalTitle,
    ModalActions,
    ButtonStrip,
    Button,
} from '@dhis2/ui';
import { IconButton } from 'capture-ui';
import { withStyles } from '@material-ui/core/styles';

type Props = {
    handleDeleteRelationship: () => void,
    disabled?: boolean,
    classes: {
        tableCell: string,
    },
}

const styles = {
    tableCell: {
        display: 'flex',
        justifyContent: 'center',
        zIndex: 1000,
    },
};

export const DeleteRelationshipPlain = ({ handleDeleteRelationship, disabled, classes }: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <>
            <DataTableCell className={classes.tableCell}>
                <IconButton
                    onClick={() => {
                        if (disabled) return;
                        setIsModalOpen(true);
                    }}
                >
                    <IconDelete16 />
                </IconButton>
            </DataTableCell>

            {isModalOpen && (
                <Modal
                    hide={!isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                >
                    <ModalTitle>{i18n.t('Delete relationship')}</ModalTitle>
                    <ModalContent>
                        {i18n.t('Deleting the relationship is permanent and cannot be undone. Are you sure you want to delete this relationship?')}
                    </ModalContent>

                    <ModalActions>
                        <ButtonStrip>
                            <Button onClick={() => setIsModalOpen(false)}>
                                {i18n.t('No, cancel')}
                            </Button>

                            <Button
                                destructive
                                onClick={() => {
                                    handleDeleteRelationship();
                                    setIsModalOpen(false);
                                }}
                            >
                                {i18n.t('Yes, delete relationship')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </>
    );
};

export const DeleteRelationship = withStyles(styles)(DeleteRelationshipPlain);
