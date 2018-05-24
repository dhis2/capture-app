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
import Grid from 'material-ui-next/Grid';

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
        '&:hover': {
            backgroundColor: 'white',
            borderColor: '#71a4f8', 
       },
    },
    selectedText: {
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 5,
        width: '100%',
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
    handleClickProgram: (value: string) => void,
    handleSetCatergoryCombo: (value: string) => void,
    resetProgram: () => void,
    selectedProgram: Object,
    classes: Object,
};

class ProgramSelector extends Component<Props> {
    handleClick: (program: Object) => void;
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(program) {
        this.props.handleClickProgram(program.id);
    }

    handleReset() {
        this.props.resetProgram();
    }

    // TODO: Add support for cat-combos.
    render() {
        const programsArray = Array.from(programs.values());

        // If program is set in Redux state.
        if (this.props.selectedProgram) {
            let selectedProgram = {};
            for (let i = 0; i < programsArray.length; i++) {
                // Get full program object based on id from this.props.selectedProgram.
                // TODO: Add CategoryCombo support.
                if (programsArray[i].id === this.props.selectedProgram) {
                    selectedProgram = programsArray[i];
                }
            }
            if(selectedProgram.categoryCombo && selectedProgram.categoryCombo.categories.length > 0 && !selectedProgram.categoryCombo.isDefault) {
                return (
                    <div>
                        <Paper elevation={1} className={this.props.classes.selectedPaper}>
                            <Grid container spacing={8}>
                                <Grid item xs={12} sm={6}>
                                    <h4 className={this.props.classes.title}>{ getTranslation('selected_program') }</h4>
                                    <p className={this.props.classes.selectedText}>{selectedProgram.name}
                                        <IconButton className={this.props.classes.selectedButton} onClick={() => this.handleReset()}>
                                            <ClearIcon className={this.props.classes.selectedButtonIcon} />
                                        </IconButton>
                                    </p>
                                </Grid>
                                {selectedProgram.categoryCombo.categories.map(i =>
                                (<Grid item xs={12} sm={6}>
                                    <h4 className={this.props.classes.title}>{i.displayName}</h4>
                                    <ACSelect options={i.categoryOptions} extraSaveParameter={i.id} handleChange={this.props.handleSetCatergoryCombo} placeholder="Select" />
                                </Grid>))}
                                <Grid item xs={12} sm={6}>
                                </Grid>
                            </Grid>
                        </Paper>
                    </div>
                );
            }
            return (
                <div>
                    <Paper elevation={1} className={this.props.classes.selectedPaper}>
                        <h4 className={this.props.classes.title}>{ getTranslation('selected_program') }</h4>
                        <p className={this.props.classes.selectedText}>{selectedProgram.name}
                            <IconButton className={this.props.classes.selectedButton} onClick={() => this.handleReset()}>
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
                    <ACSelect options={programsArray} selected={this.props.selectedProgram ? this.props.selectedProgram : ''} handleChange={this.props.handleClickProgram} placeholder="Select program" />
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(ProgramSelector);
