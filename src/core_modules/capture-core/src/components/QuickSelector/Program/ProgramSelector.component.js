// @flow

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import Grid from '@material-ui/core/Grid';
import i18n from '@dhis2/d2-i18n';

import programCollection from 'capture-core/metaDataMemoryStores/programCollection/programCollection';
import VirtualizedSelect from '../../FormFields/Options/SelectVirtualizedV2/OptionsSelectVirtualized.component';
import ProgramList from './ProgramList';

import EventProgram from '../../../metaData/Program/EventProgram';
import { resetProgramIdBase } from '../actions/QuickSelector.actions';
import './programSelector.css';
import Program from '../../../metaData/Program/Program';
import LinkButton from '../../Buttons/LinkButton.component';

const styles = (theme: Theme) => ({
    paper: {
        padding: 8,
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
    selectedText: {
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 5,
        padding: 5,
        borderLeft: '2px solid #71a4f8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    selectedTextContainer: {
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
    },
    selectedTextAndIconContainer: {
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
    },
    selectedProgramNameContainer: {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
    },
    selectedCategoryNameContainer: {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
    },
    selectedPaper: {
        backgroundColor: theme.palette.grey.lighter,
        borderRadius: 8,
        padding: 8,
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
    programsHiddenText: {
        fontSize: 12,
        color: theme.palette.grey.dark,
        paddingTop: 5,
    },
    programsHiddenTextResetOrgUnit: {
        cursor: 'pointer',
        color: 'inherit',
        paddingLeft: 2,
    },
    noProgramsContainer: {
        fontSize: 14,
        textAlign: 'center',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        border: '1px solid lightGrey',
    },
    iconContainer: {
        display: 'flex',
        alignItems: 'center',
        paddingRight: 5,
    },
    icon: {
        width: 22,
        height: 22,
        borderRadius: 2,
    },
});

type Props = {
    handleClickProgram: (value: string) => void,
    handleSetCatergoryCombo: (category: Object, categoryId: string) => void,
    onResetProgramId: (baseAction: ReduxAction<any, any>) => void,
    onResetCategoryOption: (categoryId: string) => void,
    onResetOrgUnit: () => void,
    buttonModeMaxLength: number,
    selectedProgram: string,
    selectedOrgUnitId: string,
    selectedCategories: Object,
    classes: Object,
};

class ProgramSelector extends Component<Props> {
    handleClick: (program: Object) => void;
    handleClickCategoryOption: (value: string, value: string) => void;
    programsArray: Array<Program>;
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleClickCategoryOption = this.handleClickCategoryOption.bind(this);
        this.buildProgramsArray();
    }

    buildProgramsArray() {
        this.programsArray = Array.from(programCollection.values());
    }

    getProgramIcon(program: Program) {
        const classes = this.props.classes;
        return program.icon.data
            ? (
                <div
                    className={classes.iconContainer}
                >
                    <img
                        style={{ backgroundColor: program.icon.color }}
                        className={classes.icon}
                        src={program.icon.data}
                        alt={program.name}
                    />
                </div>
            )
            : null;
    }

    getOptionsFromPrograms(programs: Array<Program>) {
        return programs
            .map(program => ({
                label: program.name,
                value: program.id,
                iconLeft: this.getProgramIcon(program),
            }));
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

    getOptions() {
        let programOptions = [];
        if (this.props.selectedOrgUnitId) {
            programOptions = this.getOptionsFromPrograms(this.programsArray
                .filter(program =>
                    program instanceof EventProgram
                    && program.organisationUnits[this.props.selectedOrgUnitId]
                    && program.access.data.read),
            );
        } else {
            programOptions = this.getOptionsFromPrograms(this.programsArray
                .filter(program => program instanceof EventProgram && program.access.data.read),
            );
        }
        return programOptions;
    }

    areAllProgramsAvailable(programOptions) {
        return (programOptions.length === this.programsArray
            .filter(program => program instanceof EventProgram && program.access.data.read).length);
    }

    renderSelectedProgram(selectedProgram) {
        return (
            <React.Fragment>
                <h4 className={this.props.classes.title}>{ i18n.t('Selected Program') }</h4>
                <div className={this.props.classes.selectedText}>
                    <div
                        className={this.props.classes.selectedTextAndIconContainer}
                    >
                        {this.getProgramIcon(selectedProgram)}
                        <div
                            className={this.props.classes.selectedProgramNameContainer}
                        >
                            {selectedProgram.name}
                        </div>
                    </div>
                    <IconButton className={this.props.classes.selectedButton} onClick={() => this.handleResetProgram()}>
                        <ClearIcon className={this.props.classes.selectedButtonIcon} />
                    </IconButton>
                </div>
            </React.Fragment>
        );
    }

    renderWithSelectedProgram(selectedProgram) {
        if (selectedProgram.categoryCombination) {
            return (
                <div>
                    <Paper elevation={0} className={this.props.classes.selectedPaper}>
                        <Grid container spacing={8}>
                            <Grid item xs={12} sm={6}>
                                {this.renderSelectedProgram(selectedProgram)}
                            </Grid>
                            {selectedProgram.categoryCombination.categories.map(i =>
                                (<Grid key={i.id} item xs={12} sm={6}>
                                    <h4 className={this.props.classes.title}>{i.name}</h4>
                                    {
                                        (() => {
                                            if (this.props.selectedCategories && this.props.selectedCategories[i.id]) {
                                                return (
                                                    <div className={this.props.classes.selectedText}>
                                                        <div className={this.props.classes.selectedCategoryNameContainer}>{i.categoryOptions.find(option => option.id === this.props.selectedCategories[i.id]).name}</div>
                                                        <IconButton className={this.props.classes.selectedButton} onClick={() => this.handleResetCategoryOption(i.id)}>
                                                            <ClearIcon className={this.props.classes.selectedButtonIcon} />
                                                        </IconButton>
                                                    </div>
                                                );
                                            }
                                            const categoryOptions = i
                                                .categoryOptions
                                                .map(optionCount => ({
                                                    label: optionCount.name,
                                                    value: optionCount.id,
                                                }));

                                            return (
                                                <VirtualizedSelect
                                                    options={categoryOptions}
                                                    onSelect={(option) => { this.handleClickCategoryOption(option, i.id); }}
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
                    {this.renderSelectedProgram(selectedProgram)}
                </Paper>
            </div>
        );
    }

    renderWithoutSelectedProgram(programOptions) {
        const { handleClickProgram, classes } = this.props;
        const areAllProgramsAvailable = this.areAllProgramsAvailable(programOptions);
        const footer = !areAllProgramsAvailable
            ? (
                <div
                    className={this.props.classes.programsHiddenText}
                >
                    {i18n.t('Some programs are being filtered.')}
                    <LinkButton
                        className={this.props.classes.programsHiddenTextResetOrgUnit}
                        onClick={() => this.handleResetOrgUnit()}
                    >
                        {i18n.t('Show all')}
                    </LinkButton>
                </div>
            )
            : null;

        return (
            <Paper elevation={0} className={classes.paper}>
                <h4 className={classes.title}>
                    { i18n.t('Program') }
                </h4>
                {
                    (() => {
                        if (programOptions.length <= this.props.buttonModeMaxLength) {
                            return (
                                <ProgramList
                                    items={programOptions}
                                    onSelect={handleClickProgram}
                                />
                            );
                        }
                        return (
                            <div>
                                <div id="program-selector">
                                    <VirtualizedSelect
                                        options={programOptions}
                                        onSelect={handleClickProgram}
                                        placeholder={i18n.t('Select program')}
                                        value={''}
                                    />
                                </div>
                            </div>
                        );
                    })()
                }
                {footer}
            </Paper>
        );
    }

    renderEmpty() {
        return (
            <div>
                <Paper elevation={0} className={this.props.classes.paper}>
                    <h4 className={this.props.classes.title}>{ i18n.t('Program') }</h4>
                    <div
                        className={this.props.classes.noProgramsContainer}
                    >
                        {i18n.t('No programs available.')}
                        <LinkButton
                            className={this.props.classes.programsHiddenTextResetOrgUnit}
                            onClick={() => this.handleResetOrgUnit()}
                        >
                            {i18n.t('Show all')}
                        </LinkButton>
                    </div>
                </Paper>
            </div>
        );
    }

    render() {
        const programOptions = this.getOptions();

        if (programOptions.length === 0) {
            return this.renderEmpty();
        }

        const selectedProgram = this.props.selectedProgram ? programCollection.get(this.props.selectedProgram) : null;
        if (selectedProgram) {
            return this.renderWithSelectedProgram(selectedProgram);
        }
        return this.renderWithoutSelectedProgram(programOptions);
    }
}

export default withStyles(styles)(ProgramSelector);
