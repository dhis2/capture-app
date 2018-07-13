// @flow
/* eslint-disable */

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import programs from 'capture-core/metaDataMemoryStores/programCollection/programCollection';
import OptionSet from 'capture-core/metaData/OptionSet/OptionSet';
import Option from 'capture-core/metaData/OptionSet/Option';

import ACSelect from 'capture-core/components/FormFields/Options/SelectVirtualized/OptionsSelectVirtualized.component';
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
import Grid from '@material-ui/core/Grid';

import i18n from '@dhis2/d2-i18n';

import EventProgram from '../../metaData/Program/EventProgram';

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
    programAC: {
        backgroundColor: 'white',
        border: '1px solid lightGrey',
        borderRadius: 5,
        padding: '0px 5px 2px 5px',
    },
});

type Props = {
    handleClickProgram: (value: string) => void,
    handleSetCatergoryCombo: (value: string, value: string) => void,
    handleResetCategorySelections: () => void,
    onResetProgramId: () => void,
    onResetCategoryOption: (categoryId: string) => void,
    buttonModeMaxLength: number,
    showWarning: boolean,
    selectedProgram: Object,
    selectedOrgUnitId: string,
    selectedCategories: Object,
    classes: Object,
};

class ProgramSelector extends Component<Props> {
    handleClick: (program: Object) => void;
    handleClickCategoryOption: (value: string, value: string) => void;
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleClickCategoryOption = this.handleClickCategoryOption.bind(this);
    }

    handleClick(program) {
        this.props.handleClickProgram(program.id);
    }

    handleClickCategoryOption(selectedCategoryOption, categoryId) {
        this.props.handleSetCatergoryCombo(selectedCategoryOption, categoryId);
    }

    handleResetProgram() {
        this.props.onResetProgramId();
    }

    handleResetCategoryOption(categoryId) {
        this.props.onResetCategoryOption(categoryId);
    }

    render() {
        const programsArray = Array.from(programs.values());
        let areSomeProgramsHidden = false;

        let programOptions = [];
        //Once we support Tracker Programs, we don´t need to filter on EventProgram only on if the orgUnit has the progrma.
        if(this.props.selectedOrgUnitId) {
            programOptions = programsArray
                .filter(program => program instanceof EventProgram && program.organisationUnits[this.props.selectedOrgUnitId])
                .map(program => new Option((_this) => {
                _this.value = program.id;
                _this.text = program.name;
            }));
        } else {
            programOptions = programsArray
                .filter(program => program instanceof EventProgram)
                .map(program => new Option((_this) => {
                _this.value = program.id;
                _this.text = program.name;
            }));
        }

        const programOptionSet = new OptionSet('programOptionSet', programOptions);

        // If program is set in Redux state.
        if (this.props.selectedProgram) {
            let selectedProgram = {};
            for (let i = 0; i < programsArray.length; i++) {
                // Get full program object based on id from this.props.selectedProgram.
                if (programsArray[i].id === this.props.selectedProgram) {
                    selectedProgram = programsArray[i];
                }
            }
            if (selectedProgram.categories) {
                return (
                    <div>
                        <Paper elevation={1} className={this.props.classes.selectedPaper}>
                            <Grid container spacing={8}>
                                <Grid item xs={12} sm={6}>
                                    <h4 className={this.props.classes.title}>{ i18n.t('Selected Program') }</h4>
                                    <p className={this.props.classes.selectedText}>{selectedProgram.name}
                                        <IconButton className={this.props.classes.selectedButton} onClick={() => this.handleResetProgram()}>
                                            <ClearIcon className={this.props.classes.selectedButtonIcon} />
                                        </IconButton>
                                    </p>
                                </Grid>
                                {selectedProgram.categories.map(i =>
                                    (<Grid key={i.id} item xs={12} sm={6}>
                                        <h4 className={this.props.classes.title}>{i.name}</h4>
                                        {
                                            (() => {
                                                if(this.props.selectedCategories && this.props.selectedCategories[i.id]) {
                                                    return (
                                                        <p className={this.props.classes.selectedText}>{i.categoryOptions.find(option => option.id === this.props.selectedCategories[i.id]).name}
                                                            <IconButton className={this.props.classes.selectedButton} onClick={() => this.handleResetCategoryOption(i.id)}>
                                                                <ClearIcon className={this.props.classes.selectedButtonIcon} />
                                                            </IconButton>
                                                        </p> 
                                                    );
                                                }
                                                const categoryOptions = i.categoryOptions.map(optionCount => new Option((_this) => {
                                                    _this.value = optionCount.id;
                                                    _this.text = optionCount.name;
                                                }));

                                                const categoryOptionSet = new OptionSet('categoryOptionSet', categoryOptions);

                                                return (
                                                    <div className={this.props.classes.programAC}>
                                                        <ACSelect optionSet={categoryOptionSet} 
                                                                  onBlur={(option) => {this.handleClickCategoryOption(option, i.id)}}
                                                                  placeholder={i18n.t('Select')}
                                                        />
                                                    </div>
                                                );
                                            })()
                                        }
                                    </Grid>))
                                }
                            </Grid>
                        </Paper>
                    </div>
                );
            }
            return (
                <div>
                    <Paper elevation={1} className={this.props.classes.selectedPaper}>
                        <h4 className={this.props.classes.title}>{ i18n.t('Selected Program') }</h4>
                        <p className={this.props.classes.selectedText}>{selectedProgram.name}
                            <IconButton className={this.props.classes.selectedButton} onClick={() => this.handleResetProgram()}>
                                <ClearIcon className={this.props.classes.selectedButtonIcon} />
                            </IconButton>
                        </p>
                    </Paper>
                </div>
            );
        }
        // If less than or equal, display as list.
        if (programsArray.length <= this.props.buttonModeMaxLength) {
            return (
                <div>
                    <Paper elevation={1} className={this.props.classes.paper}>
                        <h4 className={this.props.classes.title}>{ i18n.t('Program') }</h4>
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
                    <h4 className={this.props.classes.title}>{ i18n.t('Program') }</h4>
                    <div className={this.props.classes.programAC}>
                        <ACSelect optionSet={programOptionSet} onBlur={this.props.handleClickProgram} placeholder={i18n.t('Select program')} />
                    </div>
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(ProgramSelector);
