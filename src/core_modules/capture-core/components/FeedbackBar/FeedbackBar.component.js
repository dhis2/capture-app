// @flow
import React, { type Node } from 'react';
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
    variant?: 'info' | 'success' | 'warning' | 'critical',
};

type Props = {
    feedback: Feedback,
    onClose: () => void,
};


const getAlertVariant = (variant?: string) => (
    variant ? { [variant]: true } : {}
);

const FeedbackBarComponentPlain = ({ feedback = {}, onClose }: Props) => {
    const { message, displayType, variant } = feedback;
    const isAlertBarOpen = typeof message === 'string' && !displayType;
    const isDialogOpen = typeof message === 'object' && displayType === 'dialog';
    const alertVariant = getAlertVariant(variant);

    return (
        <>
            <AlertStack>
                {isAlertBarOpen && (
                    <AlertBar {...alertVariant} duration={5000}>
                        {message}
                    </AlertBar>
                )}
            </AlertStack>
            {isDialogOpen && (
                <Modal hide={!isDialogOpen}>
                    <ModalTitle>{message?.title || ''}</ModalTitle>
                    <ModalContent>{message?.content || ''}</ModalContent>
                    <ModalActions>
                        <Button onClick={onClose} primary>
                            {i18n.t('Close')}
                        </Button>
                    </ModalActions>
                </Modal>
            )}
        </>
    );
};

export const FeedbackBarComponent = withStyles(styles)(FeedbackBarComponentPlain);
