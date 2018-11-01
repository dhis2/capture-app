// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';

import OrgUnitField from './OrgUnitField.container';
import withLoadingIndicator from '../../HOC/withLoadingIndicator';


const styles = () => ({
    paper: {
        padding: 5,
        backgroundColor: '#f6f6f6',
        borderRadius: 5,
    },
    title: {
        margin: 0,
        fontWeight: 425,
        fontSize: 15,
        paddingBottom: 5,
    },
    form: {
        width: '100%',
    },
    listItem: {
        backgroundColor: '#ffffff',
        borderRadius: 5,
        marginBottom: 5,
        padding: 5,
        border: '1px solid lightGrey',
    },
    selectedText: {
        marginTop: 5,
        marginBottom: 5,
        padding: 5,
        borderLeft: '2px solid #71a4f8',
    },
    selectedPaper: {
        backgroundColor: '#f6f6f6',
        borderRadius: 5,
        padding: 5,
    },
    selectedButton: {
        float: 'right',
        width: 20,
        height: 20,
    },
    selectedButtonIcon: {
        width: 20,
        height: 20,
    },
});

type Props = {
    handleClickOrgUnit: (orgUnitId: ?string, orgUnitObject: ?Object) => void,
    onReset: () => void,
    selectedOrgUnitId: string,
    showWarning: boolean,
    selectedOrgUnit: Object,
    classes: Object,
};

type State = {
    open: boolean,
};

class OrgUnitSelector extends Component<Props, State> {
    handleShowWarning: () => void;
    handleClose: () => void;
    handleClick: (orgUnit: Object) => void;
    handleReset: () => void;
    constructor(props) {
        super(props);

        this.state = {
            open: false,
        };

        this.handleShowWarning = this.handleShowWarning.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    handleShowWarning() {
        if (this.props.showWarning) {
            this.setState({ open: true });
        } else {
            this.handleReset();
        }
    }

    handleClose() {
        this.setState({ open: false });
    }

    handleClick(event, selectedOu) {
        const orgUnitObject = { id: selectedOu.id, name: selectedOu.displayName };
        this.props.handleClickOrgUnit(selectedOu.id, orgUnitObject);
    }

    handleReset() {
        this.props.handleClickOrgUnit(undefined, null);
    }

    render() {
        // If orgUnit is set in Redux state.
        if (this.props.selectedOrgUnitId) {
            return (
                <div>
                    <Paper elevation={1} className={this.props.classes.selectedPaper}>
                        <h4 className={this.props.classes.title}>{ i18n.t('Selected registering unit') }</h4>
                        <p className={this.props.classes.selectedText}>{this.props.selectedOrgUnit.name}
                            <IconButton
                                className={this.props.classes.selectedButton}
                                onClick={() => this.props.onReset()}
                            >
                                <ClearIcon className={this.props.classes.selectedButtonIcon} />
                            </IconButton>
                        </p>
                    </Paper>
                    <Dialog
                        open={this.state.open}
                        onClose={this.handleClose}
                    >
                        <DialogTitle>{i18n.t('Start Again')}</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure? All unsaved data will be lost.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="secondary">
                                Cancel
                            </Button>
                            <Button onClick={this.handleReset} color="primary" autoFocus>
                                Accept
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            );
        }

        return (
            <div>
                <Paper elevation={1} className={this.props.classes.paper}>
                    <h4 className={this.props.classes.title}>{ i18n.t('Registering Organisation Unit') }</h4>
                    <div>
                        <OrgUnitField
                            onSelectClick={this.handleClick}
                        />
                    </div>
                </Paper>
            </div>
        );
    }
}

export default withLoadingIndicator()(withStyles(styles)(OrgUnitSelector));
