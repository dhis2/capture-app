// @flow
/* eslint-disable */

import React, { Component } from 'react';
import { withStyles } from 'material-ui-next/styles';

import  ACSelect from './AutocompleteSelect.component';

import programs from 'capture-core/metaDataMemoryStores/programCollection/programCollection';
import List, { ListItem, ListItemText } from 'material-ui-next/List';
import Select from 'material-ui-next/Select';
import { MenuItem } from 'material-ui-next/Menu';
import { FormControl } from 'material-ui-next/Form';
import { InputLabel } from 'material-ui-next/Input';
import Paper from 'material-ui-next/Paper';
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
                        <h4 className={this.props.classes.title}>{ getTranslation('selected_program') }</h4>
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
                        <h4 className={this.props.classes.title}>{ getTranslation('program') }</h4>
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
                    <h4 className={this.props.classes.title}>{ getTranslation('program') }</h4>
                    <ACSelect options={programsArray} selected={this.props.selectedProgram ? this.props.selectedProgram : ''} handleChange={this.props.handleClickProgram} placeholder="Program" />
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(ProgramSelector);
