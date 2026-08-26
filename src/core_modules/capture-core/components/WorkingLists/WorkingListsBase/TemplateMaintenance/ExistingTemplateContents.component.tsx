import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, ButtonStrip, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui';

type Props = {
    onSaveTemplate: () => void;
    onClose: () => void;
};

export const ExistingTemplateContents = (props: Props) => {
    const { onSaveTemplate, onClose } = props;
    return (
        <React.Fragment>
            <ModalTitle>{i18n.t('Save')}</ModalTitle>
            <ModalContent />
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onClose}>
                        {i18n.t('Cancel')}
                    </Button>
                    <Button onClick={onSaveTemplate} primary>
                        {i18n.t('Save')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </React.Fragment>
    );
};

