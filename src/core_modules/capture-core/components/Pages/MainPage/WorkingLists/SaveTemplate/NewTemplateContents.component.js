// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import Button from '../../../../Buttons/Button.component';

type Props = {
    onSaveTemplate: () => void,
    onClose: () => void,
};

const NewTemplateContents = (props: Props) => {
    const { onSaveTemplate, onClose } = props;
    return (
        <React.Fragment>
            <DialogTitle>{i18n.t('Save As')}</DialogTitle>
            <DialogContent>
            </DialogContent>
            <DialogActions>
                <Button onClick={onSaveTemplate} color="primary">
                    {i18n.t('Save')}
                </Button>
            </DialogActions>
        </React.Fragment>
    );
};

export default NewTemplateContents;
