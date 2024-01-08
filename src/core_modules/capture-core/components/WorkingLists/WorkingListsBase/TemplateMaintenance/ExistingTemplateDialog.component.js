// @flow
import * as React from 'react';
import { Modal } from '@dhis2/ui';
import { ExistingTemplateContents } from './ExistingTemplateContents.component';

type Props = {
    open: boolean,
    onClose: () => void,
    onSaveTemplate: () => void,
};

export const ExistingTemplateDialog = (props: Props) => {
    const {
        open,
        onClose,
        onSaveTemplate,
    } = props;

    if (!open) {
        return null;
    }

    return (
        <Modal
            hide={!open}
            onClose={onClose}
            position={'center'}
            dataTest={'existing-template-dialog'}
        >
            <ExistingTemplateContents
                onSaveTemplate={onSaveTemplate}
                onClose={onClose}
            />
        </Modal>
    );
};
