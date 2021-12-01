// @flow
import { Dialog } from '@material-ui/core';
import * as React from 'react';
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
