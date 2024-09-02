// @flow
import React, { useState, type Node } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Modal, ModalTitle, ModalContent, ModalActions, AlertStack, AlertBar } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';

const styles = () => ({
    closeButton: {
        marginTop: '5px',
    },
    actionContainer: {
        paddingRight: 2,
    },
});

type Feedback = {
    message: string | { title: string, content: string },
    action?: Node,
    displayType?: 'alert' | 'dialog',
};

type Props = {
    feedback: Feedback,
    onClose: () => void,
};

const FeedbackBarComponentPlain = ({ feedback = {}, onClose }: Props) => {
    const [hide, setHide] = useState(false);
    const { message, displayType } = feedback;
    const isAlertBarOpen = typeof message === 'string' && !displayType;
    const isDialogOpen = typeof message === 'object' && displayType === 'dialog';

    const handleClose = () => {
        setHide(true);
        onClose();
    };

    return (
        <>
            <AlertStack>
                {isAlertBarOpen && (
                    <AlertBar duration={5000}>
                        {message}
                    </AlertBar>
                )}
            </AlertStack>
            {isDialogOpen && (
                <Modal hide={hide}>
                    <ModalTitle>{message.title || ''}</ModalTitle>
                    <ModalContent>{message.content || ''}</ModalContent>
                    <ModalActions>
                        <Button onClick={handleClose} primary>
                            {i18n.t('Close')}
                        </Button>
                    </ModalActions>
                </Modal>
            )}
        </>
    );
};

export const FeedbackBarComponent = withStyles(styles)(FeedbackBarComponentPlain);
