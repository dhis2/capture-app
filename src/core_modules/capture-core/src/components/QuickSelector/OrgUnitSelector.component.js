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

import IconButton from 'material-ui-next/IconButton';
import ClearIcon from 'material-ui-icons/Clear';

import { getTranslation } from '../../d2/d2Instance';

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
});

type Props = {
    handleChangeOrgUnit: (value: string) => void,
    handleClickOrgUnit: (value: string) => void,
    selectedOrgUint: Object,
    classes: Object,
};

class OrgUnitSelector extends Component<Props> {
    handleChange: (event: any) => void;
    handleClick: (orgunit: Object) => void;
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange(event) {
        this.props.handleChangeOrgUnit(event.target.value);
    }

    handleClick(orgunit) {
        this.props.handleClickOrgUnit(orgunit.id);
    }

    // TODO:Add OrgUnitTree when there are a lot of orgunits
    render() {
        // TODO: Add real data and remove placeholder data.
        const orgUnits = [{ id: 1, name: 'OrgUnit 1' }, { id: 2, name: 'OrgUnit 2' }, { id: 3, name: 'OrgUnit 3' },
            { id: 4, name: 'OrgUnit 4' }, { id: 5, name: 'OrgUnit 5' }, { id: 6, name: 'OrgUnit 6' }];

        // If program is set in Redux state. TODO: Remove .name (orgUnit is set with testing data, should be empty).
        if (this.props.selectedOrgUint.name) {
            return (
                <div>
                    <Paper elevation={1} className={this.props.classes.selectedPaper}>
                        <h4 className={this.props.classes.title}>{ getTranslation('selected_orgunit') }</h4>
                        <p className={this.props.classes.selectedText}>{this.props.selectedOrgUint.name}
                            <IconButton className={this.props.classes.selectedButton}>
                                <ClearIcon className={this.props.classes.selectedButtonIcon} />
                            </IconButton>
                        </p>
                    </Paper>
                </div>
            );
        }
        // If less than or equal, display as list.
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
                    <FormControl className={this.props.classes.form}>
                        <InputLabel htmlFor="orgUnit-selector">Registering unit</InputLabel>
                        <Select
                            value={this.props.selectedOrgUint ? this.props.selectedOrgUint.id : ''}
                            onChange={this.handleChange}
                            inputProps={{
                                name: 'orgUnit',
                                id: 'orgUnit-selector',
                            }}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem
                                key={this.props.selectedOrgUint ? this.props.selectedOrgUint.id : ''}
                                value={this.props.selectedOrgUint ? this.props.selectedOrgUint.id : ''}
                            >
                                {this.props.selectedOrgUint ? this.props.selectedOrgUint.name : ''}
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <br />
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(OrgUnitSelector);
