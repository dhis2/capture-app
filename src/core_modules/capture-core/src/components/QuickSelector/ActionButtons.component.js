// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import SearchIcon from '@material-ui/icons/Search';

import i18n from '@dhis2/d2-i18n';

const styles = () => ({
    container: {
        flexGrow: 1,
        padding: 10,
        textAlign: 'right',
    },
    leftButton: {
        float: 'left',
    },
    rightButton: {
        marginRight: 5,
    },
});

type Props = {
    handleClickStartAgainButton: () => void,
    selectedProgram: string,
    selectedOrgUnitId: string,
    showWarning: boolean,
    classes: Object,
};

class ActionButtons extends Component<Props> {
    handleClick: () => void;
    constructor(props) {
        super(props);
        this.handleStartAgainClick = this.handleStartAgainClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleAcceptClick = this.handleAcceptClick.bind(this);
        this.dialogElement = this.dialogElement.bind(this);

        this.state = {
            open: false,
        };
    }

    handleStartAgainClick = () => {
        if (this.props.showWarning) {
            this.setState({ open: true });
        } else {
            this.props.handleClickStartAgainButton();
        }
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleAcceptClick = () => {
        this.props.handleClickStartAgainButton();
    }

    dialogElement = () => {
        return (
            <Dialog
                open={this.state.open}
                onClose={this.handleClose}
            >
                <DialogTitle>{"Start Again"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure? All unsaved data will be lost.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleAcceptClick} color="primary" autoFocus>
                        Accept
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    // TODO: Add translation.
    render() {
        if (!this.props.selectedProgram && !this.props.selectedOrgUnitId) {
            return (
                <div className={this.props.classes.container}>
                    <Button
                        onClick={this.handleStartAgainClick}
                        color="primary"
                        className={this.props.classes.leftButton}
                    >
                        { i18n.t('Reset') }
                    </Button>
                    {this.dialogElement()}
                </div>
            );
        }
        return (
            <div className={this.props.classes.container}>
                <Button
                    onClick={this.handleStartAgainClick}
                    color="primary"
                    className={this.props.classes.leftButton}
                >
                    { i18n.t('Reset') }
                </Button>
                {this.dialogElement()}
                <Button
                    onClick={this.handleStartAgainClick}
                    color="primary"
                >
                    <AddIcon className={this.props.classes.rightButton} />
                    { i18n.t('New') }
                </Button>
                <Button
                    onClick={this.handleStartAgainClick}
                    color="primary"
                >
                    <SearchIcon className={this.props.classes.rightButton} />
                    { i18n.t('Find') }
                </Button>
            </div>
        );
    }
}

export default withStyles(styles)(ActionButtons);
