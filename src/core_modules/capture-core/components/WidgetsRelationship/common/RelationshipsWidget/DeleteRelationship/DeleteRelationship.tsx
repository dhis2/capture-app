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
    colors,
} from '@dhis2/ui';
import { IconButton } from 'capture-ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import type { Props } from './DeleteRelationship.types';
import { useTermLabel } from '../../../../../metaData';
import { customTerms } from '../../../../../utils/customTerms';

const styles: Readonly<any> = {
    tableCell: {
        display: 'flex',
        justifyContent: 'center',
    },
};

export const DeleteRelationshipPlain = ({
    handleDeleteRelationship,
    disabled,
    classes,
}: Props & WithStyles<typeof styles>) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const relationshipLabel = useTermLabel('relationship');
    return (
        <>
            <DataTableCell className={classes.tableCell}>
                <IconButton
                    onClick={() => {
                        if (disabled) return;
                        setIsModalOpen(true);
                    }}
                    dataTest={'delete-relationship-button'}
                >
                    <IconDelete16 color={colors.red600} />
                </IconButton>
            </DataTableCell>

            {isModalOpen && (
                <Modal
                    hide={!isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    dataTest={'delete-relationship-modal'}
                >
                    <ModalTitle>
                        {customTerms.i18n.t('Delete {{relationshipLabel}}', { relationshipLabel })}
                    </ModalTitle>
                    <ModalContent>
                        {customTerms.i18n.t(
                            'Deleting the {{relationshipLabel}} is permanent and cannot be undone.',
                            { relationshipLabel },
                        )}
                        {' '}
                        {customTerms.i18n.t(
                            'Are you sure you want to delete this {{relationshipLabel}}?',
                            { relationshipLabel },
                        )}
                    </ModalContent>

                    <ModalActions>
                        <ButtonStrip>
                            <Button onClick={() => setIsModalOpen(false)}>
                                {i18n.t('No, cancel')}
                            </Button>

                            <Button
                                destructive
                                dataTest={'delete-relationship-confirmation-button'}
                                onClick={() => {
                                    handleDeleteRelationship();
                                    setIsModalOpen(false);
                                }}
                            >
                                {customTerms.i18n.t('Yes, delete {{relationshipLabel}}', { relationshipLabel })}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </>
    );
};

export const DeleteRelationship = withStyles(styles)(DeleteRelationshipPlain);
