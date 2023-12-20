// @flow
import * as React from 'react';
import SnackBar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';
import { IconButton } from 'capture-ui';
import { IconCross24, Button, Modal, ModalTitle, ModalContent, ModalActions } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import isDefined from 'd2-utilizr/lib/isDefined';

const styles = () => ({
    closeButton: {
        marginTop: '5px',
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
            <>
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
                    className={classes.closeButton}
                    onClick={this.handleClose}
                >
                    <IconCross24 />
                </IconButton>
            </>
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
                {isDialogOpen && (
                    <Modal
                        hide={!isDialogOpen}
                    >
                        <ModalTitle>
                            {
                            // $FlowFixMe[prop-missing] automated comment
                                isDialogOpen ? message && message.title : ''}
                        </ModalTitle>
                        <ModalContent>
                            {
                            // $FlowFixMe[prop-missing] automated comment
                                isDialogOpen ? message && message.content : ''}
                        </ModalContent>
                        <ModalActions>
                            <Button onClick={this.handleClose} primary>
                                {i18n.t('Close')}
                            </Button>
                        </ModalActions>
                    </Modal>
                )}
            </React.Fragment>
        );
    }
}
Index.displayName = 'FeedbackBar';

export const FeedbackBarComponent = withStyles(styles)(Index);
