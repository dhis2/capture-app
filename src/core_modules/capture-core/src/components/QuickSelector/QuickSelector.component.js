// @flow
/* eslint-disable */

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import programs from 'capture-core/metaDataMemoryStores/programCollection/programCollection';

import ProgramSelector from 'capture-core/components/QuickSelector/ProgramSelector.component';
import OrgUnitSelector from 'capture-core/components/QuickSelector/OrgUnitSelector.component';
import ActionButtons from 'capture-core/components/QuickSelector/ActionButtons.component';

const styles = () => ({
    paper: {
        flexGrow: 1,
        padding: 10,
    },
});

type Props = {
    selectedOrgUnitId: string,
    selectedProgramId: string,
    selectedCategories: Object,
    storedOrgUnits: Object,
    classes: Object,
    onSetOrgUnitId: (orgUnitId: string) => void,
    onStoreOrgUnitObject: (orgUnitObject: Object) => void,
    onSetProgramId: (programId: string) => void,
    onSetCategoryOptionId: (categoryId: string, selectedCategoryOptionId: string) => void,
    onResetCategoryOptionSelections: () => void,
};

class QuickSelector extends Component<Props> {
    handleClickProgram: (program: Object) => void;
    handleSetCatergoryCombo: (selectedCategoryOption: string, categoryId: string) => void;
    resetProgram: () => void;
    handleClickOrgUnit: (orgUnit: Object) => void;
    handleClickActionButton: () => void;
    constructor(props) {
        super(props);

        this.handleClickProgram = this.handleClickProgram.bind(this);
        this.handleSetCatergoryCombo = this.handleSetCatergoryCombo.bind(this);
        this.resetProgram = this.resetProgram.bind(this);
        this.handleClickOrgUnit = this.handleClickOrgUnit.bind(this);
        this.handleClickActionButton = this.handleClickActionButton.bind(this);
    }

    handleClickProgram(program) {
        this.props.onSetProgramId(program);
    }

    handleSetCatergoryCombo(selectedCategoryOption, categoryId) {
        this.props.onSetCategoryOptionId(categoryId, selectedCategoryOption);
    }

    resetProgram() {
        this.props.onSetProgramId(null);
    }

    handleClickOrgUnit(orgUnitId, orgUnitObject) {
        this.props.onSetOrgUnitId(orgUnitId);

        if (orgUnitObject) {
            this.props.onStoreOrgUnitObject(orgUnitObject);
        }
    }

    // Restart button
    handleClickActionButton() {
        this.props.onSetOrgUnitId(undefined);
        this.props.onSetProgramId(null);
        this.props.onResetCategoryOptionSelections();
    }

    // TODO: Add support for cat-combos.
    render() {
        // The grid has a total width of 12 columns, we need to calculate how much width each selector should have.
        let orgUnitSelectorWidth = 3;
        let programSelectorWidth = 3;
        let actionButtonsWidth = 6;

        let selectedProgram = {};
        
        if(this.props.selectedProgramId) {
            const programsArray = Array.from(programs.values());
            for (let i = 0; i < programsArray.length; i++) {
                if (programsArray[i].id === this.props.selectedProgramId) {
                    selectedProgram = programsArray[i];
                }
            }
        }

        if (this.props.selectedOrgUnitId && this.props.selectedProgramId) {
            if (selectedProgram.categoryCombo && selectedProgram.categoryCombo.categories.length > 0 && !selectedProgram.categoryCombo.isDefault) {
                orgUnitSelectorWidth = 3;
                programSelectorWidth = 5;
                actionButtonsWidth = 4;
            } else {
                orgUnitSelectorWidth = 3;
                programSelectorWidth = 3;
                actionButtonsWidth = 6;
            }
        } else if (!this.props.selectedOrgUnitId && this.props.selectedProgramId) {
            if (selectedProgram.categoryCombo && selectedProgram.categoryCombo.categories.length > 0 && !selectedProgram.categoryCombo.isDefault) {
                orgUnitSelectorWidth = 3;
                programSelectorWidth = 5;
                actionButtonsWidth = 4;
            } else {
                orgUnitSelectorWidth = 3;
                programSelectorWidth = 3;
                actionButtonsWidth = 6;
            }
        } else if (this.props.selectedOrgUnitId && !this.props.selectedProgramId) {
            orgUnitSelectorWidth = 3;
            programSelectorWidth = 3;
            actionButtonsWidth = 6;
        } 

        return (
            <Paper className={this.props.classes.paper}>
                <Grid container spacing={16}>
                    <Grid item xs={12} sm={orgUnitSelectorWidth}>
                        <OrgUnitSelector
                            selectedOrgUint={this.props.selectedOrgUnitId}
                            handleClickOrgUnit={this.handleClickOrgUnit}
                            storedOrgUnits={this.props.storedOrgUnits}
                        />
                    </Grid>
                    <Grid item xs={12} sm={programSelectorWidth}>
                        <ProgramSelector
                            selectedProgram={this.props.selectedProgramId}
                            selectedCategories={this.props.selectedCategories}
                            handleClickProgram={this.handleClickProgram}
                            handleSetCatergoryCombo={this.handleSetCatergoryCombo}
                            handleResetCategorySelection={this.props.onResetCategoryOptionSelections}
                            resetProgram={this.resetProgram}
                            buttonModeMaxLength={5}
                        />
                    </Grid>
                    <Grid item xs={12} sm={actionButtonsWidth}>
                        <ActionButtons
                            handleClickActionButton={this.handleClickActionButton}
                            selectedProgram={this.props.selectedProgramId}
                            selectedOrgUint={this.props.selectedOrgUnitId}
                        />
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

export default withStyles(styles)(QuickSelector);
