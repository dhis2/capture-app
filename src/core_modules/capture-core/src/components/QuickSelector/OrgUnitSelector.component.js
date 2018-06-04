// @flow
/* eslint-disable */

import React, { Component } from 'react';
import { withStyles } from 'material-ui-next/styles';

import List, { ListItem, ListItemText } from 'material-ui-next/List';
import Select from 'material-ui-next/Select';
import { MenuItem } from 'material-ui-next/Menu';
import { FormControl } from 'material-ui-next/Form';
import { InputLabel } from 'material-ui-next/Input';
import Paper from 'material-ui-next/Paper';

import IconButton from 'material-ui-next/IconButton';
import ClearIcon from 'material-ui-icons/Clear';

import { getTranslation, getCurrentUser } from '../../d2/d2Instance';
import { OrgUnitTreeMultipleRoots } from '@dhis2/d2-ui-org-unit-tree';


const styles = () => ({
    paper: {
        padding: 15,
        backgroundColor: '#f6f6f6',
        borderRadius: 5,
    },
    title: {
        margin: 0,
        fontWeight: 425,
        fontSize: 15,
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
    orgunittree: {
        backgroundColor: 'white',
        border: '1px solid lightGrey',
        borderRadius: 5,
        padding: 5,
    },
});

type Props = {
    handleClickOrgUnit: (orgUnitId: string, orgUnitObject: Object) => void,
    selectedOrgUint: string,
    storedOrgUnits: Object,
    classes: Object,
};

class OrgUnitSelector extends Component<Props> {
    handleClick: (orgUnit: Object) => void;
    handleReset: () => void;
    constructor(props) {
        super(props);

        this.state = {
			roots: [],
		};

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

    handleClick(event, selectedOu) {
        const orgUnitObject = {id: selectedOu.id, name: selectedOu.displayName, path: selectedOu.path};
        this.props.handleClickOrgUnit(selectedOu.id, orgUnitObject);
    }

    handleReset() {
        this.props.handleClickOrgUnit(undefined);
    }

    // TODO:Add OrgUnitTree when there are a lot of orgunits
    render() {
        // TODO: Add real data and remove placeholder data.
        const orgUnits = [{ id: 1, name: 'OrgUnit 1' }, { id: 2, name: 'OrgUnit 2' }, { id: 3, name: 'OrgUnit 3' },
            { id: 4, name: 'OrgUnit 4' }, { id: 5, name: 'OrgUnit 5' }, { id: 6, name: 'OrgUnit 6' }];

        // If orgUnit is set in Redux state.
        if (this.props.selectedOrgUint) {
            return (
                <div>
                    <Paper elevation={1} className={this.props.classes.selectedPaper}>
                        <h4 className={this.props.classes.title}>{ getTranslation('selected_orgunit') }</h4>
                        <p className={this.props.classes.selectedText}>{this.props.storedOrgUnits[this.props.selectedOrgUint].name}
                            <IconButton className={this.props.classes.selectedButton} onClick={() => this.handleReset()}>
                                <ClearIcon className={this.props.classes.selectedButtonIcon} />
                            </IconButton>
                        </p>
                    </Paper>
                </div>
            );
        }
        // TODO: Find a way to know how many total orgunits the user is assigned to.
        // If less than or equal to 5 orgUnits, display as list.
        if (orgUnits.length <= 5) {
            return (
                <div>
                    <Paper elevation={1} className={this.props.classes.paper}>
                        <h4 className={this.props.classes.title}>{ getTranslation('orgunit') }</h4>
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
        }
        // TODO: Make proper orgunitTree. Only the selected orgunit is shown in the option list.
        return (
            <div>
                <Paper elevation={1} className={this.props.classes.paper}>
                    <h4 className={this.props.classes.title}>{ getTranslation('orgunit') }</h4>
                    <div className={this.props.classes.orgunittree}>
                        <OrgUnitTreeMultipleRoots
                            roots={this.state.roots}
                            hideCheckboxes
                            selected={this.props.selectedOrgUint}
                            onSelectClick={this.handleClick}
                        />
                    </div>
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(OrgUnitSelector);
