// @flow
import React, { Component } from 'react';
import { withStyles } from 'material-ui-next/styles';

import List, { ListItem, ListItemText } from 'material-ui-next/List';
import Select from 'material-ui-next/Select';
import { MenuItem } from 'material-ui-next/Menu';
import { FormControl } from 'material-ui-next/Form';
import { InputLabel } from 'material-ui-next/Input';
import Paper from 'material-ui-next/Paper';

const styles = () => ({
    paper: {
        padding: 15,
        backgroundColor: '#f6f6f6',
        borderRadius: 5,
    },
    form: {
        width: '100%',
    },
    listItem: {
        backgroundColor: '#ffffff',
        borderRadius: 5,
        margin: 5,
    },
});

class OrgUnitSelector extends Component {
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
        const orgUnits = [{ id: 1, name: 'OrgUnit 1' }, { id: 2, name: 'OrgUnit 2' }, { id: 3, name: 'OrgUnit 3' }, { id: 4, name: 'OrgUnit 4' }, { id: 5, name: 'OrgUnit 5' }, { id: 6, name: 'OrgUnit 6' }];
        // If less than or equal, display as list.
        if (orgUnits.length <= 5) {
            return (
                <div>
                    <Paper elevation={1} className={this.props.classes.paper}>
                        <List>
                            {orgUnits.map(i => <ListItem className={this.props.classes.listItem} button onClick={() => this.handleClick(i)}><ListItemText primary={i.name} /></ListItem>)}
                        </List>
                    </Paper>
                </div>
            );
        }
        return (
            <div>
                <Paper elevation={1} className={this.props.classes.paper}>
                    <FormControl className={this.props.classes.form}>
                        <InputLabel htmlFor="orgUnit-selector">Organisation Unit</InputLabel>
                        <Select
                            value={this.props.selectedOrgUint}
                            onChange={this.handleChange}
                            inputProps={{
                                name: 'orgUnit',
                                id: 'orgUnit-selector',
                            }}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {orgUnits.map(i => <MenuItem key={i.id} value={i.id}>{i.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <br />
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(OrgUnitSelector);
