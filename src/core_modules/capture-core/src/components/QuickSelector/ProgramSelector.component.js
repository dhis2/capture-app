// @flow
import React, { Component } from 'react';
import programs from 'capture-core/metaDataMemoryStores/programCollection/programCollection';
import List, { ListItem, ListItemText } from 'material-ui-next/List';
import Select from 'material-ui-next/Select';
import { MenuItem } from 'material-ui-next/Menu';
import { FormControl } from 'material-ui-next/Form';
import { InputLabel } from 'material-ui-next/Input';
import Paper from 'material-ui-next/Paper';

export default class ProgramSelector extends Component {
    constructor(props) {
        super(props);
        this.state = { program: '' };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({ program: event.target.value });
    }

    handleClick(program) {
        this.setState({ program: program.id });
    }

    // TODO: Add support for cat-combos.
    render() {
        const programsArray = Array.from(programs.values());
        // If less than or equal, display as list.
        if (programsArray.length <= 5) {
            return (
                <div>
                    <Paper elevation={1} style={{ padding: 15, backgroundColor: '#f6f6f6', borderRadius: 5 }}>
                        <List>
                            {programsArray.map(i => <ListItem button onClick={() => this.handleClick(i)}><ListItemText primary={i.name} /></ListItem>)}
                        </List>
                        <br />
                    </Paper>
                    <h1>{this.state.program}</h1>
                </div>
            );
        }
        return (
            <div>
                <Paper elevation={1} style={{ padding: 15, backgroundColor: '#f6f6f6', borderRadius: 5 }}>
                    <FormControl style={{ width: '100%' }}>
                        <InputLabel htmlFor="program-selector">Program</InputLabel>
                        <Select
                            value={this.state.program}
                            onChange={this.handleChange}
                            inputProps={{
                                name: 'program',
                                id: 'program-selector',
                            }}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {programsArray.map(i => <MenuItem key={i.id} value={i.id}>{i.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <br />
                </Paper>
                <h1>{this.state.program}</h1>
            </div>
        );
    }
}
