// @flow
import * as React from 'react';
import SnackBar from '@material-ui/core/Snackbar';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import i18n from '@dhis2/d2-i18n';
import isDefined from 'd2-utilizr/lib/isDefined';
import { Button } from '../Buttons';

const styles = theme => ({
    closeButton: {
        width: theme.spacing.unit * 4,
        height: theme.spacing.unit * 4,
    },
    actionContainer: {
        paddingRight: 2,
    },
});

type Feedback = {
    message: string | { title: string, content: string},
    action?: ?React.Node,
    displayType?: ?string,
};

type Props = {
    feedback: Feedback,
    onClose: () => void,
    classes: Object,
};

class Index extends React.Component<Props> {
    static defaultProps = {
        feedback: {},
    };

    constructor(props: Props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
    }
    static CLICKAWAY_KEY = 'clickaway';

    static ANCHOR_ORIGIN = {
        vertical: 'bottom',
        horizontal: 'center',
    };

    handleClose = (event?: ?Object, reason?: ?string) => {
        if (reason !== Index.CLICKAWAY_KEY) {
            this.props.onClose();
        }
    }

    getAction() {
        const { feedback, classes } = this.props;

        return (
            <span>
                {
                    (() => {
                        if (!feedback.action) {
                            return null;
                        }

                        return (
                            <span
                                className={classes.actionContainer}
                            >
                                {feedback.action}
                            </span>
                        );
                    })()
                }
                <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    className={classes.closeButton}
                    onClick={this.handleClose}
                >
                    <CloseIcon />
                </IconButton>
            </span>
        );
    }

    render() {
        const { feedback } = this.props;
        const { message, displayType } = feedback;
        const isSnackBarOpen = isDefined(message) && !displayType;
        const isDialogOpen = isDefined(message) && displayType === 'dialog';
        return (
            <React.Fragment>
                <SnackBar
                    open={isSnackBarOpen}
                    anchorOrigin={Index.ANCHOR_ORIGIN}
                    autoHideDuration={5000}
                    onClose={this.handleClose}
                    // $FlowFixMe[incompatible-type] automated comment
                    message={<span>{message}</span>}
                    action={this.getAction()}
                />
                <Dialog
                    open={isDefined(message) && displayType === 'dialog'}
                >
                    <DialogTitle>
                        {
                            // $FlowFixMe[prop-missing] automated comment
                            isDialogOpen ? message && message.title : ''}
                    </DialogTitle>
                    <DialogContent>
                        {
                            // $FlowFixMe[prop-missing] automated comment
                            isDialogOpen ? message && message.content : ''}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} primary>
                            {i18n.t('Close')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>
        );
    }
}
Index.displayName = 'FeedbackBar';

export const FeedbackBarComponent = withStyles(styles)(Index);
