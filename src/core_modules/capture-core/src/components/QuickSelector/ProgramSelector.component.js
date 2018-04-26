// @flow
import React, { Component } from 'react';
import { withStyles } from 'material-ui-next/styles';

import programs from 'capture-core/metaDataMemoryStores/programCollection/programCollection';
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

class ProgramSelector extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange(event) {
        this.props.handleChangeProgram(event.target.value);
    }

    handleClick(program) {
        this.props.handleClickProgram(program.id);
    }

    // TODO: Add support for cat-combos.
    render() {
        const programsArray = Array.from(programs.values());
        // If less than or equal, display as list.
        if (programsArray.length <= 5) {
            return (
                <div>
                    <Paper elevation={1} className={this.props.classes.paper}>
                        <List>
                            {programsArray.map(i => <ListItem className={this.props.classes.listItem} button onClick={() => this.handleClick(i)}><ListItemText primary={i.name} /></ListItem>)}
                        </List>
                    </Paper>
                </div>
            );
        }
        return (
            <div>
                <Paper elevation={1} className={this.props.classes.paper}>
                    <FormControl className={this.props.classes.form}>
                        <InputLabel htmlFor="program-selector">Program</InputLabel>
                        <Select
                            value={this.props.selectedProgram}
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
            </div>
        );
    }
}

export default withStyles(styles)(ProgramSelector);
