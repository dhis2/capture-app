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

    render() {
        const orgUnits = [{ id: 1, name: 'OrgUnit 1' }, { id: 2, name: 'OrgUnit 2' }, { id: 3, name: 'OrgUnit 3' }, { id: 4, name: 'OrgUnit 4' }];
        if (orgUnits.length <= 3) {
            return (
                <Paper elevation={1} style={{ padding: 15 }}>
                    <List>
                        {orgUnits.map(i => <ListItem button><ListItemText primary={i.name} /></ListItem>)}
                    </List>
                    <br />
                </Paper>
            );
        }
        return (
            <div>
                <Paper elevation={1} style={{ padding: 15 }}>
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
