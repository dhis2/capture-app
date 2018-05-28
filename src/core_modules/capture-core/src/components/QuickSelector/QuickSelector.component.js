// @flow
import React, { Component } from 'react';
import { withStyles } from 'material-ui-next/styles';

import Paper from 'material-ui-next/Paper';
import Grid from 'material-ui-next/Grid';

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
    selectedOrgUnit: Object,
    selectedProgramId: string,
    selectedCategories: Object,
    classes: Object,
    onSetProgramId: (programId: string) => void,
    onSetCategoryOptionId: (categoryId: string, selectedCategoryOptionId: string) => void,
};

class QuickSelector extends Component<Props> {
    handleClickProgram: (program: Object) => void;
    handleSetCatergoryCombo: (selectedCategoryOption: string, categoryId: string) => void;
    resetProgram: () => void;
    handleChangeOrgUnit: (orgUnit: any) => void;
    handleClickOrgUnit: (orgUnit: Object) => void;
    handleClickActionButton: () => void;
    constructor(props) {
        super(props);

        this.handleClickProgram = this.handleClickProgram.bind(this);
        this.handleSetCatergoryCombo = this.handleSetCatergoryCombo.bind(this);
        this.resetProgram = this.resetProgram.bind(this);
        this.handleChangeOrgUnit = this.handleChangeOrgUnit.bind(this);
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

    handleChangeOrgUnit(orgUnit) {
        alert('OrgUnit switching has not yet been implemented.');
    }

    handleClickOrgUnit(orgUnit) {
        alert('OrgUnit switching has not yet been implemented.');
    }

    handleClickActionButton() {
        // Also reset orgUnit.
        this.props.onSetProgramId(null);
        this.props.onSetCategoryOptionId(null, null);
    }

    // TODO: Add support for cat-combos.
    render() {
        return (
            <Paper className={this.props.classes.paper}>
                <Grid container spacing={16}>
                    <Grid item xs={12} sm={4} md={3}>
                        <OrgUnitSelector
                            selectedOrgUint={this.props.selectedOrgUnit}
                            handleChangeOrgUnit={this.handleChangeOrgUnit}
                            handleClickOrgUnit={this.handleClickOrgUnit}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} md={5}>
                        <ProgramSelector
                            selectedProgram={this.props.selectedProgramId}
                            selectedCategories={this.props.selectedCategories}
                            handleClickProgram={this.handleClickProgram}
                            handleSetCatergoryCombo={this.handleSetCatergoryCombo}
                            resetProgram={this.resetProgram}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <ActionButtons
                            handleClickActionButton={this.handleClickActionButton}
                            selectedProgram={this.props.selectedProgramId}
                            selectedOrgUint={this.props.selectedOrgUnit ? this.props.selectedOrgUnit.id : ''}
                        />
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

export default withStyles(styles)(QuickSelector);
