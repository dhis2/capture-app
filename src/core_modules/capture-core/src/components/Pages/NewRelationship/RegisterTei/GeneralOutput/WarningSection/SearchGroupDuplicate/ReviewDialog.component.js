// @flow
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import i18n from '@dhis2/d2-i18n';
import ReviewDialogContents from './ReviewDialogContents.container';

type Props = {
    open: boolean,
    onCancel: () => void,
    onLink: Function,
};

class ReviewDialog extends React.Component<Props> {
    render() {
        const { open, onCancel, onLink } = this.props;
        return (
            <Dialog
                open={open}
                fullWidth
                maxWidth={'md'}
                onClose={onCancel}
            >
                <ReviewDialogContents
                    onLink={onLink}
                />
                <DialogActions>
                    <Button onClick={onCancel} color="primary">
                        {i18n.t('Cancel')}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default ReviewDialog;
