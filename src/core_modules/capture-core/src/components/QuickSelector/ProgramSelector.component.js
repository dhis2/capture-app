// @flow
/* eslint-disable */

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import programs from 'capture-core/metaDataMemoryStores/programCollection/programCollection';
import OptionSet from 'capture-core/metaData/OptionSet/OptionSet';
import Option from 'capture-core/metaData/OptionSet/Option';
import VirtualizedSelect from '../FormFields/Options/SelectVirtualizedV2/OptionsSelectVirtualized.component';
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
import { resetProgramIdBase } from './actions/QuickSelector.actions';

const styles = (theme: Theme) => ({
    paper: {
        padding: 5,
        backgroundColor: theme.palette.grey.lighter,
        borderRadius: 8,
    },
    title: {
        margin: 0,
        fontWeight: 425,
        fontSize: 15,
        paddingBottom: 5,
    },
    form: {
        width: '100%',
    },
    programList: {
        padding: 0,
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
    selectedItemContainer: {
        display: 'flex',
        alignItems: 'center',
        minHeight: 28,
        margin: '7px 0px 7px 0px',
        paddingLeft: 5,
        borderLeft: `2px solid ${theme.palette.primary.light}`,
    },
    selectedItemClear: {
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'flex-end',
    },
    selectedPaper: {
        backgroundColor: theme.palette.grey.lighter,
        borderRadius: 5,
        padding: 5,
    },
    selectedButton: {
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
    programsHiddenText: {
        fontSize: 12,
        color: 'grey',
        paddingTop: 5,
    },
    programsHiddenTextResetOrgUnit: {
        cursor: 'pointer',
    },
    noProgramsAvailableNotAvailable: {
        fontSize: 14,
        textAlign: 'center',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        border: '1px solid lightGrey',
    },
});

type Props = {
    handleClickProgram: (value: string) => void,
    handleSetCatergoryCombo: (value: string, value: string) => void,
    handleResetCategorySelections: () => void,
    onResetProgramId: (baseAction: ReduxAction<any, any>) => void,
    onResetCategoryOption: (categoryId: string) => void,
    onResetOrgUnit: () => void,
    buttonModeMaxLength: number,
    showWarning: boolean,
    selectedProgram: string,
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
        this.props.handleClickProgram(program.value);
    }

    handleClickCategoryOption(selectedCategoryOption, categoryId) {
        this.props.handleSetCatergoryCombo(selectedCategoryOption, categoryId);
    }

    handleResetProgram() {
        this.props.onResetProgramId(resetProgramIdBase());
    }

    handleResetCategoryOption(categoryId) {
        this.props.onResetCategoryOption(categoryId);
    }

    handleResetOrgUnit() {
        this.props.onResetOrgUnit();
    }

    render() {
        const programsArray = Array.from(programs.values());
        let areAllProgramsAvailable = true;

        let programOptions = [];
        //Once we support Tracker Programs, we don´t need to filter on EventProgram only on if the orgUnit has the progrma.
        if(this.props.selectedOrgUnitId) {
            programOptions = programsArray
                .filter(program => program instanceof EventProgram && program.organisationUnits[this.props.selectedOrgUnitId] && program.access.data.read)
                .map(program => new Option((_this) => {
                _this.value = program.id;
                _this.text = program.name;
            }));

            areAllProgramsAvailable = programOptions.length == programsArray.filter(program => program instanceof EventProgram && program.access.data.read).length;

        } else {
            programOptions = programsArray
                .filter(program => program instanceof EventProgram && program.access.data.read)
                .map(program => new Option((_this) => {
                _this.value = program.id;
                _this.text = program.name;
            }));
        }

        const programOptionSet = new OptionSet('programOptionSet', programOptions);

        // If program is set in Redux state.
        const selectedProgram = this.props.selectedProgram ? programs.get(this.props.selectedProgram) : null;

        if (selectedProgram) {
            if (selectedProgram.categoryCombination) {
                return (
                    <div>
                        <Paper elevation={0} className={this.props.classes.selectedPaper}>
                            <Grid container spacing={8}>
                                <Grid item xs={12} sm={6}>
                                    <h4 className={this.props.classes.title}>{ i18n.t('Selected Program') }</h4>
                                    <div className={this.props.classes.selectedItemContainer}>
                                        <div>{selectedProgram.name}</div>
                                        <div className={this.props.classes.selectedItemClear}>
                                            <IconButton className={this.props.classes.selectedButton} onClick={() => this.handleResetProgram()}>
                                                <ClearIcon className={this.props.classes.selectedButtonIcon} />
                                            </IconButton>
                                        </div>
                                    </div>
                                </Grid>
                                {selectedProgram.categoryCombination.categories.map(i =>
                                    (<Grid key={i.id} item xs={12} sm={6}>
                                        <h4 className={this.props.classes.title}>{i.name}</h4>
                                        {
                                            (() => {
                                                if(this.props.selectedCategories && this.props.selectedCategories[i.id]) {
                                                    return (
                                                        <div className={this.props.classes.selectedItemContainer}>
                                                            <div>{i.categoryOptions.find(option => option.id === this.props.selectedCategories[i.id]).name}</div>
                                                            <div className={this.props.classes.selectedItemClear}>
                                                                <IconButton className={this.props.classes.selectedButton} onClick={() => this.handleResetCategoryOption(i.id)}>
                                                                    <ClearIcon className={this.props.classes.selectedButtonIcon} />
                                                                </IconButton>
                                                            </div>

                                                        </div> 
                                                    );
                                                }
                                                const categoryOptions = i.categoryOptions.map(optionCount => new Option((_this) => {
                                                    _this.value = optionCount.id;
                                                    _this.text = optionCount.name;
                                                }));

                                                const categoryOptionSet = new OptionSet('categoryOptionSet', categoryOptions);

                                                return (
                                                    <VirtualizedSelect optionSet={categoryOptionSet} 
                                                                onSelect={(option) => {this.handleClickCategoryOption(option, i.id)}}
                                                                value={''}
                                                                placeholder={i18n.t('Select')}
                                                    />
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
                    <Paper elevation={0} className={this.props.classes.selectedPaper}>
                        <h4 className={this.props.classes.title}>{ i18n.t('Selected Program') }</h4>
                        <div className={this.props.classes.selectedItemContainer}>
                            <div>
                                {selectedProgram.name}
                            </div>
                            <div className={this.props.classes.selectedItemClear}>
                                <IconButton className={this.props.classes.selectedButton} onClick={() => this.handleResetProgram()}>
                                    <ClearIcon className={this.props.classes.selectedButtonIcon} />
                                </IconButton>
                            </div>
                        </div>
                    </Paper>
                </div>
            );
        }
        if (programOptions.length == 0) {
            return (
                <div>
                    <Paper elevation={0} className={this.props.classes.paper}>
                        <h4 className={this.props.classes.title}>{ i18n.t('Program') }</h4>
                        <div className={this.props.classes.noProgramsAvailableNotAvailable}>{i18n.t('No programs available.')} <a className={this.props.classes.programsHiddenTextResetOrgUnit} onClick={() => this.handleResetOrgUnit()}>{i18n.t('Show all')}</a></div>
                    </Paper>
                </div>
            );
        }
        // If less than or equal, display as list.
        if (programOptions.length <= this.props.buttonModeMaxLength) {
            return (
                <div>
                    <Paper elevation={0} className={this.props.classes.paper}>
                        <h4 className={this.props.classes.title}>{ i18n.t('Program') }</h4>
                        <List className={this.props.classes.programList}>
                            {programOptions.map(i =>
                                (<ListItem
                                    className={this.props.classes.listItem}
                                    button
                                    onClick={() => this.handleClick(i)}
                                    key={i.value}
                                >
                                    <ListItemText primary={i.text} /></ListItem>))}
                        </List>
                        {
                            (() => {
                                if(!areAllProgramsAvailable) {
                                    return (
                                        <div className={this.props.classes.programsHiddenText}>{i18n.t('Some programs are being filtered.')} <a className={this.props.classes.programsHiddenTextResetOrgUnit} onClick={() => this.handleResetOrgUnit()}>{i18n.t('Show all')}</a></div>
                                    );
                                }
                            })()
                        }
                    </Paper>
                </div>
            );
        }
        return (
            <div>
                <Paper elevation={0} className={this.props.classes.paper}>
                    <h4 className={this.props.classes.title}>{ i18n.t('Program') }</h4>
                        <VirtualizedSelect optionSet={programOptionSet} onSelect={this.props.handleClickProgram} placeholder={i18n.t('Select program')} value={''} />
                    {
                        (() => {
                            if(!areAllProgramsAvailable) {
                                return (
                                    <div className={this.props.classes.programsHiddenText}>{i18n.t('Some programs are being filtered.')} <a className={this.props.classes.programsHiddenTextResetOrgUnit} onClick={() => this.handleResetOrgUnit()}>{i18n.t('Show all')}</a></div>
                                );
                            }
                        })()
                    }
                </Paper>
            </div>
        );
    }
}

export default withStyles(styles)(ProgramSelector);
