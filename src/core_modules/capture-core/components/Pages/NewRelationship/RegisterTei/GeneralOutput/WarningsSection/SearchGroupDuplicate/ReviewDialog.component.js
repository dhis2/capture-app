// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import { ReviewDialogContents } from './ReviewDialogContents.container';

type Props = {
  open: boolean,
  onCancel: () => void,
  onLink: Function,
  extraActions?: ?React.Node,
};

const StyledDialogActions = withStyles({
  root: { margin: 24 },
})(DialogActions);

class ReviewDialogClass extends React.Component<Props> {
  paperProps = {
    style: {
      maxHeight: 'calc(100% - 100px)',
    },
  };

  render() {
    const { open, onCancel, onLink, extraActions } = this.props;

    return (
      <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth PaperProps={this.paperProps}>
        <ReviewDialogContents onLink={onLink} />
        <StyledDialogActions>{extraActions}</StyledDialogActions>
      </Dialog>
    );
  }
}

export const ReviewDialog = ReviewDialogClass;
