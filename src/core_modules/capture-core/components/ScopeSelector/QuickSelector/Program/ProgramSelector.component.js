// @flow

import React, { Component, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { useHistory, useLocation } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import Grid from '@material-ui/core/Grid';
import i18n from '@dhis2/d2-i18n';
import { colors } from '@dhis2/ui';
import { programCollection } from '../../../../metaDataMemoryStores';
import { OptionsSelectVirtualized } from '../../../FormFields/Options/SelectVirtualizedV2/OptionsSelectVirtualized.component';
import { ProgramList } from './ProgramList';
import { CategorySelector } from '../../../CategorySelector';

import type { Program } from '../../../../metaData';
import { resetProgramIdBase } from '../actions/QuickSelector.actions';
import './programSelector.css';
import { LinkButton } from '../../../Buttons/LinkButton.component';
import { buildUrlQueryString, useLocationQuery } from '../../../../utils/routing';
import { NonBundledDhis2Icon } from '../../../NonBundledDhis2Icon';

const EmptyPrograms = ({ classes, handleResetOrgUnit }) => {
    const { push } = useHistory();
    const { pathname } = useLocation();
    const { enrollmentId, teiId, orgUnitId } = useLocationQuery();


    useEffect(() => {
        const navigateToEventRegistrationPage = () => {
            push(`${pathname}?${buildUrlQueryString({ enrollmentId, teiId, orgUnitId })}`);
        };

        navigateToEventRegistrationPage();
    }, [push, pathname, enrollmentId, teiId, orgUnitId]);

    return (
        <Paper square elevation={0} className={classes.paper}>
            <h4 className={classes.title}>{ i18n.t('Program') }</h4>
            <div
                className={classes.noProgramsContainer}
            >
                {i18n.t('No programs available.')}
                <LinkButton
                    className={classes.programsHiddenTextResetOrgUnit}
                    onClick={handleResetOrgUnit}
                >
                    {i18n.t('Show all')}
                </LinkButton>
            </div>
        </Paper>
    );
};

const styles = (theme: Theme) => ({
    border: {
        borderRight: `1px solid ${colors.grey500}`,
    },
    paper: {
        padding: 8,
        backgroundColor: theme.palette.grey.lighter,
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
        marginTop: 6,
        marginBottom: 4,
        padding: 5,
        borderLeft: `2px solid ${colors.blue600}`,
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
        padding: 8,
    },
    selectedButton: {
        float: 'right',
        width: 20,
        height: 20,
        padding: 0,
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

class ProgramSelectorPlain extends Component<Props> {
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

    getProgramIcon({ icon: { color, name } = {}, name: programName }: Program) {
        const { classes } = this.props;

        return (
            <div
                className={classes.iconContainer}
            >
                <NonBundledDhis2Icon
                    name={name || 'clinical_fe_outline'}
                    color={color || '#e0e0e0'}
                    alternativeText={programName}
                    width={22}
                    height={22}
                    cornerRadius={2}
                />
            </div>
        );
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
                    program.organisationUnits[this.props.selectedOrgUnitId] &&
                    program.access.data.read),
            );
        } else {
            programOptions = this.getOptionsFromPrograms(this.programsArray
                .filter(program => program.access.data.read),
            );
        }
        return programOptions;
    }

    areAllProgramsAvailable(programOptions) {
        return (programOptions.length === this.programsArray
            .filter(program => program.access.data.read).length);
    }

    renderSelectedProgram(selectedProgram) {
        return (
            <React.Fragment>
                <h4 className={this.props.classes.title}>{ i18n.t('Selected program') }</h4>
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
                    <IconButton data-test="reset-selection-button" className={this.props.classes.selectedButton} onClick={() => this.handleResetProgram()}>
                        <ClearIcon className={this.props.classes.selectedButtonIcon} />
                    </IconButton>
                </div>
            </React.Fragment>
        );
    }

    renderWithSelectedProgram(selectedProgram) {
        if (selectedProgram.categoryCombination) {
            const { classes, selectedCategories, selectedOrgUnitId } = this.props;
            return (
                <Grid container>
                    <Grid item xs={12} sm={6} className={this.props.classes.border}>
                        <Paper square elevation={0} className={classes.selectedPaper}>
                            {this.renderSelectedProgram(selectedProgram)}
                        </Paper>
                    </Grid>
                    {
                        // $FlowFixMe
                        Array.from(selectedProgram.categoryCombination.categories.values()).map((category) => {
                            const { id, name } = category;
                            return (<Grid key={id} item xs={12} sm={6}>
                                <Paper square elevation={0} className={classes.selectedPaper}>
                                    <h4 className={classes.title}>{name}</h4>
                                    {
                                        (() => {
                                            if (selectedCategories && selectedCategories[id]) {
                                                return (
                                                    <div className={classes.selectedText}>
                                                        <div className={classes.selectedCategoryNameContainer}>{selectedCategories[category.id].name}</div>
                                                        <IconButton data-test="reset-selection-button" className={classes.selectedButton} onClick={() => this.handleResetCategoryOption(category.id)}>
                                                            <ClearIcon className={classes.selectedButtonIcon} />
                                                        </IconButton>
                                                    </div>
                                                );
                                            }
                                            return (
                                                <CategorySelector
                                                    category={{ id, displayName: name }}
                                                    // $FlowFixMe[incompatible-call] automated comment
                                                    onSelect={(option) => { this.handleClickCategoryOption(option, category.id); }}
                                                    selectedOrgUnitId={selectedOrgUnitId}
                                                />
                                            );
                                        })()
                                    }
                                </Paper>
                            </Grid>);
                        })
                    }
                </Grid>
            );
        }

        return (
            <Paper square elevation={0} className={this.props.classes.selectedPaper}>
                {this.renderSelectedProgram(selectedProgram)}
            </Paper>
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
            <Paper square elevation={0} className={classes.paper} data-test="program-selector-container">
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
                                    <OptionsSelectVirtualized
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

    render() {
        const programOptions = this.getOptions();

        if (programOptions.length === 0) {
            return <EmptyPrograms classes={this.props.classes} handleResetOrgUnit={this.props.onResetOrgUnit} />;
        }

        const selectedProgram = this.props.selectedProgram ? programCollection.get(this.props.selectedProgram) : null;
        if (selectedProgram) {
            return this.renderWithSelectedProgram(selectedProgram);
        }
        return this.renderWithoutSelectedProgram(programOptions);
    }
}
export const ProgramSelector = withStyles(styles, { index: 1 })(ProgramSelectorPlain);
