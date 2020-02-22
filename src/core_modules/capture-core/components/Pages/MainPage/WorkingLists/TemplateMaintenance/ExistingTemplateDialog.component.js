// @flow
import * as React from 'react';
import { Dialog } from '@material-ui/core';
import ExistingTemplateContents from './ExistingTemplateContents.component';

type Props = {
    open: boolean,
    onClose: () => void,
    onSaveTemplate: () => void,
};

const ExistingTemplateDialog = (props: Props) => {
    const {
        open,
        onClose,
        onSaveTemplate,
    } = props;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
        >
            <ExistingTemplateContents
                onSaveTemplate={onSaveTemplate}
                onClose={onClose}
            />
        </Dialog>
    );
};

export default ExistingTemplateDialog;
