// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { Button, ModalTitle, ModalContent, ModalActions } from '@dhis2/ui';

const getStyles = () => ({
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },
});

type Props = {
    onSaveTemplate: () => void,
    onClose: () => void,
    classes: Object,
};

const ExistingTemplateContentsPlain = (props: Props) => {
    const { onSaveTemplate, onClose, classes } = props;
    return (
        <React.Fragment>
            <ModalTitle>{i18n.t('Save')}</ModalTitle>
            <ModalContent />
            <ModalActions
                className={classes.buttonContainer}
            >
                <Button onClick={onClose}>
                    {i18n.t('Cancel')}
                </Button>
                <Button onClick={onSaveTemplate} primary>
                    {i18n.t('Save')}
                </Button>
            </ModalActions>
        </React.Fragment>
    );
};

export const ExistingTemplateContents = withStyles(getStyles)(ExistingTemplateContentsPlain);
