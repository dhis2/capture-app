// @flow
import React, { Component } from 'react';
import List, { ListItem, ListItemText } from 'material-ui-next/List';
import Select from 'material-ui-next/Select';
import { MenuItem } from 'material-ui-next/Menu';
import { FormControl } from 'material-ui-next/Form';
import { InputLabel } from 'material-ui-next/Input';
import Paper from 'material-ui-next/Paper';

export default class OrgUnitSelector extends Component {
    constructor(props) {
        super(props);
        this.state = { orgUnit: '' };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({ orgUnit: event.target.value });
    }

    handleClick(orgunit) {
        this.setState({ orgUnit: orgunit.id });
    }

    // TODO:Add OrgUnitTree when there are a lot of orgunits 
    render() {
        // TODO: Add real data and remove placeholder data.
        const orgUnits = [{ id: 1, name: 'OrgUnit 1' }, { id: 2, name: 'OrgUnit 2' }, { id: 3, name: 'OrgUnit 3' }, { id: 4, name: 'OrgUnit 4' }, { id: 5, name: 'OrgUnit 5' }, { id: 6, name: 'OrgUnit 6' }];
        // If less than or equal, display as list.
        if (orgUnits.length <= 5) {
            return (
                <div>
                    <Paper elevation={1} style={{ padding: 15, backgroundColor: '#f6f6f6', borderRadius: 5 }}>
                        <List>
                            {orgUnits.map(i => <ListItem button onClick={() => this.handleClick(i)}><ListItemText primary={i.name} /></ListItem>)}
                        </List>
                    </Paper>
                    <h1>{this.state.orgUnit}</h1>
                </div>
            );
        }
        return (
            <div>
                <Paper elevation={1} style={{ padding: 15, backgroundColor: '#f6f6f6', borderRadius: 5 }}>
                    <FormControl style={{ width: '100%' }}>
                        <InputLabel htmlFor="orgUnit-selector">Organisation Unit</InputLabel>
                        <Select
                            value={this.state.orgUnit}
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
                <h1>{this.state.orgUnit}</h1>
            </div>
        );
    }
}
