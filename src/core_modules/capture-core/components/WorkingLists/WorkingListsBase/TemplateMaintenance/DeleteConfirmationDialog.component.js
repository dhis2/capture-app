// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { Button, Modal, ModalTitle, ModalContent, ModalActions } from '@dhis2/ui';

const getStyles = () => ({
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },
});

type Props = {
    open: boolean,
    onClose: () => void,
    onDeleteTemplate: () => void,
    templateName: string,
    classes: Object,
};

const DeleteConfirmationDialogPlain = (props: Props) => {
    const {
        open,
        onClose,
        onDeleteTemplate,
        templateName,
        classes,
    } = props;

    if (!open) {
        return null;
    }

    return (
        <Modal
            hide={!open}
            onClose={onClose}
        >
            <ModalTitle>{i18n.t('Delete view')}</ModalTitle>
            <ModalContent>
                {i18n.t('Do you really want to delete the \'{{templateName}}\' view?', { templateName })}
            </ModalContent>
            <ModalActions
                className={classes.buttonContainer}
            >
                <Button onClick={onClose}>
                    {i18n.t('Cancel')}
                </Button>
                <Button onClick={onDeleteTemplate} primary>
                    {i18n.t('Confirm')}
                </Button>
            </ModalActions>
        </Modal>
    );
};

export const DeleteConfirmationDialog = withStyles(getStyles)(DeleteConfirmationDialogPlain);
