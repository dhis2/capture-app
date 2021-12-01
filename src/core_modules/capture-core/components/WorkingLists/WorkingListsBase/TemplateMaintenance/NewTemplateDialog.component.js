// @flow
import { Dialog } from '@material-ui/core';
import * as React from 'react';
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
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
        >
            <NewTemplateContents
                onSaveTemplate={onSaveTemplate}
                onClose={onClose}
            />
        </Dialog>
    );
};
