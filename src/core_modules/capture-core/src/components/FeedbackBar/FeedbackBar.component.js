// @flow
import * as React from 'react';
import isDefined from 'd2-utilizr/lib/isDefined';
import SnackBar from '@material-ui/core/Snackbar';
import { withStyles, withTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

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
    message: string,
    action?: ?React.Node,
};

type Props = {
    feedback: Feedback,
    onClose: () => void,
    classes: Object,
    theme: Object,
};

class FeedbackBar extends React.Component<Props> {
    static CLICKAWAY_KEY = 'clickaway';

    static ANCHOR_ORIGION = {
        vertical: 'bottom',
        horizontal: 'center',
    };

    static defaultProps = {
        feedback: {},
    };

    handleClose: (event?: ?Object, reason: string) => void;
    constructor(props: Props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose(event?: ?Object, reason: string) {
        if (reason !== FeedbackBar.CLICKAWAY_KEY) {
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

        return (
            <SnackBar
                open={isDefined(feedback.message)}
                anchorOrigin={FeedbackBar.ANCHOR_ORIGION}
                autoHideDuration={5000}
                onClose={this.handleClose}
                message={<span>{feedback.message}</span>}
                action={this.getAction()}
            />
        );
    }
}

export default withStyles(styles)(withTheme()(FeedbackBar));
