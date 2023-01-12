// @flow

import React, { Component, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { SelectorBarItem, Menu, MenuItem, MenuDivider, Button } from '@dhis2/ui';
import { useHistory, useLocation } from 'react-router-dom';
import i18n from '@dhis2/d2-i18n';
import { programCollection } from '../../../../metaDataMemoryStores';
import { CategorySelector } from './CategorySelector.component';
import type { Program } from '../../../../metaData';
import { resetProgramIdBase } from '../actions/QuickSelector.actions';
import { buildUrlQueryString, useLocationQuery } from '../../../../utils/routing';
import { NonBundledDhis2Icon } from '../../../NonBundledDhis2Icon';
import { FiltrableMenuItems } from '../FiltrableMenuItems';

const EmptyPrograms = ({ handleResetOrgUnit }) => {
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
        <MenuItem
            label={
                <div>
                    {i18n.t('No programs available.')}
                    &nbsp;
                    <Button secondary onClick={() => handleResetOrgUnit()}>
                        {i18n.t('Show all')}
                    </Button>
                </div>
            }
        />
    );
};

const styles = () => ({
    iconContainer: {
        display: 'flex',
        alignItems: 'center',
        paddingRight: 5,
    },
    selectBarMenu: {
        minWidth: '60vw',
        maxHeight: '90vh',
        overflow: 'scroll',
    },
});

type Props = {
    handleClickProgram?: (value: string) => void,
    handleSetCatergoryCombo?: (category: Object, categoryId: string) => void,
    onResetProgramId: (baseAction: ReduxAction<any, any>) => void,
    onResetCategoryOption: (categoryId: string) => void,
    onResetOrgUnit: () => void,
    selectedProgram?: string,
    selectedOrgUnitId?: string,
    selectedCategories: Object,
    classes: Object,
};

type State = {
    open: boolean,
};

class ProgramSelectorPlain extends Component<Props, State> {
    handleClick: (program: Object) => void;
    handleClickCategoryOption: (category: Object, categoryId: string) => void;
    programsArray: Array<Program>;
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
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
        const { handleClickProgram } = this.props;
        handleClickProgram && handleClickProgram(program.value);
    }

    handleClickCategoryOption(selectedCategoryOption, categoryId) {
        const { handleSetCatergoryCombo } = this.props;
        handleSetCatergoryCombo && handleSetCatergoryCombo(selectedCategoryOption, categoryId);
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

    renderCategories(selectedProgram) {
        if (selectedProgram?.categoryCombination) {
            const { selectedCategories, selectedOrgUnitId } = this.props;
            return Array.from(selectedProgram.categoryCombination.categories.values()).map(category => (
                <CategorySelector
                    category={category}
                    selectedCategoryName={
                        selectedCategories && selectedCategories[category.id]
                            ? selectedCategories[category.id].name
                            : ''
                    }
                    // $FlowFixMe[incompatible-call] automated comment
                    onSelect={(option) => {
                        this.handleClickCategoryOption(option, category.id);
                    }}
                    onClearSelectionClick={() => this.handleResetCategoryOption(category.id)}
                    selectedOrgUnitId={selectedOrgUnitId}
                />
            ));
        }
        return null;
    }

    renderProgramList(programOptions) {
        const { handleClickProgram } = this.props;
        const areAllProgramsAvailable = this.areAllProgramsAvailable(programOptions);
        return (
            <>
                <FiltrableMenuItems
                    options={programOptions}
                    onChange={(item) => {
                        this.setState({ open: false });
                        handleClickProgram && handleClickProgram(item.value);
                    }}
                    searchText={i18n.t('Search for a program')}
                    dataTest="program"
                />
                {!areAllProgramsAvailable && (
                    <>
                        <MenuDivider />
                        <MenuItem
                            label={
                                <div>
                                    {i18n.t('Some programs are being filtered by the registring unit selection')}
                                    &nbsp;
                                    <Button onClick={() => this.handleResetOrgUnit()} secondary>
                                        {i18n.t('Show all programs')}
                                    </Button>
                                </div>
                            }
                        />
                    </>
                )}
            </>
        );
    }

    render() {
        const programOptions = this.getOptions();
        const { classes } = this.props;
        const selectedProgram = this.props.selectedProgram ? programCollection.get(this.props.selectedProgram) : null;

        return (
            <>
                <SelectorBarItem
                    label={'Program'}
                    noValueMessage="Select program"
                    value={selectedProgram?.name}
                    open={this.state.open}
                    setOpen={open => this.setState({ open })}
                    onClearSelectionClick={() => this.handleResetProgram()}
                >
                    <div className={classes.selectBarMenu}>
                        <Menu>
                            {programOptions.length === 0
                                ? (
                                    <EmptyPrograms handleResetOrgUnit={() => this.handleResetOrgUnit()} />
                                )
                                : (
                                    <>
                                        {this.renderProgramList(programOptions)}
                                        {Boolean(selectedProgram) && (
                                            <>
                                                <MenuDivider />
                                                <MenuItem
                                                    onClick={() => this.handleResetProgram()}
                                                    label={i18n.t('Clear selection')}
                                                />
                                            </>
                                        )}
                                    </>
                                )}
                        </Menu>
                    </div>
                </SelectorBarItem>
                {this.renderCategories(selectedProgram)}
            </>
        );
    }
}
export const ProgramSelector = withStyles(styles, { index: 1 })(ProgramSelectorPlain);
