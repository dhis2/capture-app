// @flow
import * as React from 'react';
import { Modal } from '@dhis2/ui';
import { NewTemplateContents } from './NewTemplateContents.component';

type Props = {
    open: boolean,
    onClose: () => void,
    onSaveTemplate: (name: string) => void,
};

export const NewTemplateDialog = (props: Props) => {
    const {
        open,
        onClose,
        onSaveTemplate,
    } = props;

    return (
        <Modal
            hide={!open}
            onClose={onClose}
            position={'center'}
        >
            <NewTemplateContents
                onSaveTemplate={onSaveTemplate}
                onClose={onClose}
            />
        </Modal>
    );
};
