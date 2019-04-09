// @flow
import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import ReviewDialogContents from './ReviewDialogContents.container';

type Props = {
    open: boolean,
    onCancel: () => void,
    onLink: Function,
    extraActions?: ?React.Node,
};

class ReviewDialog extends React.Component<Props> {
    static paperProps = {
        style: {
            maxHeight: 'calc(100% - 100px)',
        },
    };

    render() {
        const { open, onCancel, onLink, extraActions } = this.props;

        return (
            <Dialog
                open={open}
                fullWidth
                maxWidth={'md'}
                onClose={onCancel}
                PaperProps={ReviewDialog.paperProps}
            >
                <ReviewDialogContents
                    onLink={onLink}
                />
                <DialogActions>
                    {extraActions}
                </DialogActions>
            </Dialog>
        );
    }
}

export default ReviewDialog;
