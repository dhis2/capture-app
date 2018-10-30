// @flow

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
    selectionComplete: boolean,
    selectedOrgUnit: Object,
    classes: Object,
    onSetOrgUnit: (orgUnitId: string, orgUnitObject: Object) => void,
    onSetProgramId: (programId: string) => void,
    onSetCategoryOption: (categoryId: string, categoryOptionId: string) => void,
    onResetOrgUnitId: () => void,
    onResetProgramId: (baseAction: ReduxAction<any, any>) => void,
    onResetCategoryOption: (categoryId: string) => void,
    onResetAllCategoryOptions: () => void,
    onStartAgain: () => void,
    onClickNew: () => void,
};

class QuickSelector extends Component<Props> {
    static getSelectedProgram(selectedProgramId: string) {
        return programs.get(selectedProgramId) || {};
    }

    handleClickProgram: (program: Object) => void;
    handleSetCatergoryCombo: (selectedCategoryOption: string, categoryId: string) => void;
    handleClickOrgUnit: (orgUnit: Object) => void;
    constructor(props) {
        super(props);

        this.handleClickProgram = this.handleClickProgram.bind(this);
        this.handleSetCatergoryCombo = this.handleSetCatergoryCombo.bind(this);
        this.handleClickOrgUnit = this.handleClickOrgUnit.bind(this);
    }

    handleClickProgram(program) {
        this.props.onSetProgramId(program);
    }

    handleSetCatergoryCombo(selectedCategoryOption, categoryId) {
        this.props.onSetCategoryOption(categoryId, selectedCategoryOption);
    }

    handleClickOrgUnit(orgUnitId, orgUnitObject) {
        this.props.onSetOrgUnit(orgUnitId, orgUnitObject);
    }

    calculateColumnWidths() {
        // The grid has a total width of 12 columns, we need to calculate how much width each selector should have.
        const selectedProgramId = this.props.selectedProgramId;
        const selectedProgram = QuickSelector.getSelectedProgram(selectedProgramId);

        let orgUnitSelectorWidth = 3;
        let programSelectorWidth = 3;
        let actionButtonsWidth = 6;

        if (selectedProgram && selectedProgram.categoryCombination) {
            orgUnitSelectorWidth = 3;
            programSelectorWidth = 6;
            actionButtonsWidth = 3;
        }

        return {
            orgUnitSelectorWidth,
            programSelectorWidth,
            actionButtonsWidth,
        };
    }

    render() {
        const { orgUnitSelectorWidth, programSelectorWidth, actionButtonsWidth } = this.calculateColumnWidths();

        return (
            <Paper className={this.props.classes.paper}>
                <Grid container spacing={16}>
                    <Grid item xs={12} sm={orgUnitSelectorWidth}>
                        <OrgUnitSelector
                            selectedOrgUnitId={this.props.selectedOrgUnitId}
                            handleClickOrgUnit={this.handleClickOrgUnit}
                            selectedOrgUnit={this.props.selectedOrgUnit}
                            onReset={this.props.onResetOrgUnitId}
                            ready={!(this.props.selectedOrgUnitId && !this.props.selectedOrgUnit)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={programSelectorWidth}>
                        <ProgramSelector
                            selectedProgram={this.props.selectedProgramId}
                            selectedOrgUnitId={this.props.selectedOrgUnitId}
                            selectedCategories={this.props.selectedCategories}
                            handleClickProgram={this.handleClickProgram}
                            handleSetCatergoryCombo={this.handleSetCatergoryCombo}
                            handleResetCategorySelections={this.props.onResetAllCategoryOptions}
                            buttonModeMaxLength={5}
                            onResetProgramId={this.props.onResetProgramId}
                            onResetCategoryOption={this.props.onResetCategoryOption}
                            onResetOrgUnit={this.props.onResetOrgUnitId}
                        />
                    </Grid>
                    <Grid item xs={12} sm={actionButtonsWidth}>
                        <ActionButtons
                            selectedProgram={this.props.selectedProgramId}
                            onStartAgain={this.props.onStartAgain}
                            onClickNew={this.props.onClickNew}
                            selectionComplete={this.props.selectionComplete}
                            showResetButton={!!(this.props.selectedProgramId || this.props.selectedOrgUnitId)}
                        />
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

export default withStyles(styles)(QuickSelector);
