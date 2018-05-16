// @flow
/* eslint-disable */

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import  ACSelect from './AutocompleteSelect.component';

import programs from 'capture-core/metaDataMemoryStores/programCollection/programCollection';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem'; 
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';

import { getTranslation } from '../../d2/d2Instance';

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
    selectedText: {
        margin: 0,
        padding: 5,
        borderLeft: '2px solid #71a4f8',
        marginLeft: 5,
    },
    selectedPaper: {
        backgroundColor: '#f6f6f6',
        borderRadius: 5,
        paddingBottom: 5,
    },
    selectedTitle: {
        padding: 5,
        margin: 0,
        fontWeight: 425,
        fontSize: 15,
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
    handleChangeProgram: (value: string) => void,
    handleClickProgram: (value: string) => void,
    selectedProgram: Object,
    classes: Object,
};

class ProgramSelector extends Component<Props> {
    handleChange: (event: any) => void;
    handleClick: (program: Object) => void;
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

        // If program is set in Redux state.
        if (this.props.selectedProgram) {
            let selectedProgram = {};
            for (let i = 0; i < programsArray.length; i++) {
                // Get full program object based on id from this.props.selectedProgram.
                if (programsArray[i].id === this.props.selectedProgram) {
                    selectedProgram = programsArray[i];
                }
            }
            return (
                <div>
                    <Paper elevation={1} className={this.props.classes.selectedPaper}>
                        <h4 className={this.props.classes.selectedTitle}>{ getTranslation('selected_program') }</h4>
                        <p className={this.props.classes.selectedText}>{selectedProgram.name}
                            <IconButton className={this.props.classes.selectedButton}>
                                <ClearIcon className={this.props.classes.selectedButtonIcon} />
                            </IconButton>
                        </p>
                    </Paper>
                </div>
            );
        }
        // If less than or equal, display as list.
        if (programsArray.length <= 5) {
            return (
                <div>
                    <Paper elevation={1} className={this.props.classes.paper}>
                        <List>
                            {programsArray.map(i =>
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
        return (
            <div>
                <Paper elevation={1} className={this.props.classes.paper}>
                    <FormControl className={this.props.classes.form}>
                        <InputLabel htmlFor="program-selector">Program</InputLabel>
                        <Select
                            value={this.props.selectedProgram ? this.props.selectedProgram : ''}
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
                    <ACSelect options={programsArray} selected={this.props.selectedProgram ? this.props.selectedProgram : ''} handleChange={this.props.handleClickProgram} placeholder="Program" />
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(ProgramSelector);
