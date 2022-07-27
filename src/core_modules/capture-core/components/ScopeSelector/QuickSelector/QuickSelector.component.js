// @flow

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { colors } from '@dhis2/ui';
import { programCollection } from 'capture-core/metaDataMemoryStores/programCollection/programCollection';
import { ProgramSelector } from './Program/ProgramSelector.component';
import { OrgUnitSelector } from './OrgUnitSelector.component';
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

class QuickSelectorPlain extends Component<Props> {
    static getSelectedProgram(selectedProgramId: string) {
        return programCollection.get(selectedProgramId) || {};
    }

    calculateColumnWidths() {
        // The grid has a total width of 12 columns, we need to calculate how much width each selector should have.
        const selectedProgramId = this.props.selectedProgramId;
        const selectedProgram = QuickSelectorPlain.getSelectedProgram(selectedProgramId);

        return {
            programSelectorWidth: selectedProgram && selectedProgram.categoryCombination ? 4 : 2,
            width: 2,
        };
    }

    render() {
        const { width, programSelectorWidth } = this.calculateColumnWidths();

        return (
            <Paper className={this.props.classes.paper}>
                <Grid container spacing={0}>
                    <Grid item xs={12} sm={programSelectorWidth * 3} md={programSelectorWidth * 2} lg={programSelectorWidth} className={this.props.classes.programSelector}>
                        <ProgramSelector
                            selectedProgram={this.props.selectedProgramId}
                            selectedOrgUnitId={this.props.selectedOrgUnitId}
                            selectedCategories={this.props.selectedCategories}
                            handleClickProgram={this.props.onSetProgramId}
                            handleSetCatergoryCombo={this.props.onSetCategoryOption}
                            handleResetCategorySelections={this.props.onResetAllCategoryOptions}
                            buttonModeMaxLength={5}
                            onResetProgramId={this.props.onResetProgramId}
                            onResetCategoryOption={this.props.onResetCategoryOption}
                            onResetOrgUnit={this.props.onResetOrgUnitId}
                        />
                    </Grid>
                    <Grid item xs={12} sm={width * 3} md={width * 2} lg={width} className={this.props.classes.orgUnitSelector}>
                        <OrgUnitSelector
                            previousOrgUnitId={this.props.previousOrgUnitId}
                            selectedOrgUnitId={this.props.selectedOrgUnitId}
                            handleClickOrgUnit={this.props.onSetOrgUnit}
                            selectedOrgUnit={this.props.selectedOrgUnit}
                            onReset={this.props.onResetOrgUnitId}
                        />
                    </Grid>
                    {this.props.children}
                </Grid>
            </Paper>
        );
    }
}

export const QuickSelector = withStyles(styles)(QuickSelectorPlain);
