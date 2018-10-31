// @flow
/* eslint-disable */

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';

import { getCurrentUser } from '../../d2/d2Instance';
//import { OrgUnitTreeMultipleRoots } from '@dhis2/d2-ui-org-unit-tree';
import OrgUnitField from './OrgUnitField.container';
import withLoadingIndicator from '../../HOC/withLoadingIndicator';

import i18n from '@dhis2/d2-i18n';


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
    orgunitTree: {
      
    },
});

type Props = {
    handleClickOrgUnit: (orgUnitId: string, orgUnitObject: Object) => void,
    onReset: () => void,
    selectedOrgUnitId: string,
    showWarning: boolean,
    selectedOrgUnit: Object,
    classes: Object,
};

class OrgUnitSelector extends Component<Props> {
    handleShowWarning: () => void;
    handleClose: () => void;
    handleClick: (orgUnit: Object) => void;
    handleReset: () => void;
    state: {
        roots: Array;
        open: false;
    };
    constructor(props) {
        super(props);

        this.state = {
            roots: [],
            open: false,
		};

        this.handleShowWarning = this.handleShowWarning.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleReset = this.handleReset.bind(this);

        const currentUser = getCurrentUser();
        // Get orgUnits assigned to currentUser and set them as roots to be used by orgUnitTree.
        currentUser.getOrganisationUnits({
            fields: 'id,path,displayName,children::isNotEmpty',
        })
        .then(roots => roots.toArray())
        .then(roots => this.setState({
            roots
        }));
    }

    handleShowWarning() {
        if (this.props.showWarning) {
            this.setState({ open: true });
        } else {
            this.handleReset();
        }
    };

    handleClose() {
        this.setState({ open: false });
    };

    handleClick(event, selectedOu) {
        const orgUnitObject = {id: selectedOu.id, name: selectedOu.displayName};
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
                            <IconButton className={this.props.classes.selectedButton} onClick={() => this.props.onReset()}>
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
        // TODO: Find a way to know how many total orgunits the user is assigned to.
        // If less than or equal to 5 orgUnits, display as list.
        /*if (orgUnits.length <= 5) {
            return (
                <div>
                    <Paper elevation={1} className={this.props.classes.paper}>
                        <h4 className={this.props.classes.title}>{ i18n.t('Registering Oraginastion Unit') }</h4>
                        <List>
                            {orgUnits.map(i =>
                                (<ListItem
                                    className={this.props.classes.listItem}
                                    button
                                    onClick={() => this.handleClick(i)}
                                >
                                    <ListItemText primary={i.name} /></ListItem>))}
                        </List>
                    </Paper>
                </div>
            );
        }*/
        
        return (
            <div>
                <Paper elevation={1} className={this.props.classes.paper}>
                    <h4 className={this.props.classes.title}>{ i18n.t('Registering Organisation Unit') }</h4>
                    <div className={this.props.classes.orgunitTree}>
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

/*
<OrgUnitTreeMultipleRoots
roots={this.state.roots}
hideCheckboxes
onSelectClick={this.handleClick}
/>
*/
