// @flow

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { colors } from '@dhis2/ui';
import programs from 'capture-core/metaDataMemoryStores/programCollection/programCollection';

import ProgramSelector from './ProgramSelector/ProgramSelector.component';
import OrgUnitSelector from './OrgUnitSelector/OrgUnitSelector.component';
import { ActionButtons } from './ActionButtons/ActionButtons.component';
import type { Props } from './QuickSelector.types';


const styles = ({ palette }) => ({
    paper: {
        flexGrow: 1,
    },
    programSelector: {
        backgroundColor: palette.grey.lighter,
        margin: '0 0 0 -1px',
    },
    orgUnitSelector: {
        backgroundColor: palette.grey.lighter,
        margin: '0 0 0 -1px',
        borderRight: `1px solid ${colors.grey500}`,
        borderLeft: `1px solid ${colors.grey500}`,
    },
});

class QuickSelector extends Component<Props> {
    static getSelectedProgram(selectedProgramId: string) {
        return programs.get(selectedProgramId) || {};
    }

    handleClickProgram: (programId: string) => void;
    handleSetCatergoryCombo: (selectedCategoryOption: string, categoryId: string) => void;
    handleClickOrgUnit: (orgUnit: Object) => void;
    constructor(props) {
        super(props);

        this.handleClickProgram = this.handleClickProgram.bind(this);
        this.handleSetCatergoryCombo = this.handleSetCatergoryCombo.bind(this);
        this.handleClickOrgUnit = this.handleClickOrgUnit.bind(this);
    }

    handleClickProgram(programId: string) {
        this.props.onSetProgramId(programId);
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

        return {
            programSelectorWidth: selectedProgram && selectedProgram.categoryCombination ? 4 : 2,
            width: 2,
        };
    }

    render() {
        const { width, programSelectorWidth } = this.calculateColumnWidths();
        const { renderExtraSelectors } = this.props;

        return (
            <Paper className={this.props.classes.paper}>
                <Grid container spacing={0}>
                    <Grid item xs={12} sm={programSelectorWidth * 3} md={programSelectorWidth * 2} lg={programSelectorWidth} className={this.props.classes.programSelector}>
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
                    <Grid item xs={12} sm={width * 3} md={width * 2} lg={width} className={this.props.classes.orgUnitSelector}>
                        <OrgUnitSelector
                            selectedOrgUnitId={this.props.selectedOrgUnitId}
                            handleClickOrgUnit={this.handleClickOrgUnit}
                            selectedOrgUnit={this.props.selectedOrgUnit}
                            onReset={this.props.onResetOrgUnitId}
                        />
                    </Grid>
                    {
                        renderExtraSelectors && renderExtraSelectors(width, this.props.classes)
                    }
                    <Grid item xs={12} sm={width * 3} md={width * 2} lg={2} >
                        <ActionButtons
                            selectedProgramId={this.props.selectedProgramId}
                            onStartAgainClick={this.props.onStartAgain}
                            onFindClick={this.props.onFindClick}
                            onFindClickWithoutProgramId={this.props.onFindClickWithoutProgramId}
                            onNewClick={this.props.onNewClick}
                            onNewClickWithoutProgramId={this.props.onNewClickWithoutProgramId}
                            showResetButton={!!(this.props.selectedProgramId || this.props.selectedOrgUnitId)}
                        />
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

export default withStyles(styles)(QuickSelector);
