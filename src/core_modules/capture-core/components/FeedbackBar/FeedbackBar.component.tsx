import React, { type ComponentType } from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { Button, Modal, ModalTitle, ModalContent, ModalActions, AlertStack, AlertBar } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { FeedbackBarComponentProps } from './FeedbackBar.types';

const styles = {
    closeButton: {
        marginTop: '5px',
    },
    actionContainer: {
        paddingRight: 2,
    },
};

type Props = FeedbackBarComponentProps & WithStyles<typeof styles>;

const getAlertVariant = (variant?: string) => (
    variant ? { [variant]: true } : {}
);

const FeedbackBarComponentPlain = ({ feedback, onClose }: Props) => {
    if (!feedback) {
        return null;
    }

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

export const FeedbackBarComponent = withStyles(styles)(FeedbackBarComponentPlain) as
    ComponentType<FeedbackBarComponentProps>;
