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
    classes: Object,
    onSetProgramId: (programId: string) => void,
};

class QuickSelector extends Component<Props> {
    handleChangeProgram: (program: any) => void;
    handleClickProgram: (program: Object) => void;
    resetProgram: () => void;
    handleChangeOrgUnit: (orgUnit: any) => void;
    handleClickOrgUnit: (orgUnit: Object) => void;
    handleClickActionButton: () => void;
    constructor(props) {
        super(props);

        this.handleChangeProgram = this.handleChangeProgram.bind(this);
        this.handleClickProgram = this.handleClickProgram.bind(this);
        this.resetProgram = this.resetProgram.bind(this);
        this.handleChangeOrgUnit = this.handleChangeOrgUnit.bind(this);
        this.handleClickOrgUnit = this.handleClickOrgUnit.bind(this);
        this.handleClickActionButton = this.handleClickActionButton.bind(this);
    }

    handleChangeProgram(program) {
        this.props.onSetProgramId(program);
    }

    handleClickProgram(program) {
        this.props.onSetProgramId(program);
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
    }

    // TODO: Add support for cat-combos.
    render() {
        return (
            <Paper className={this.props.classes.paper}>
                <Grid container spacing={24}>
                    <Grid item xs={12} sm={4}>
                        <OrgUnitSelector
                            selectedOrgUint={this.props.selectedOrgUnit}
                            handleChangeOrgUnit={this.handleChangeOrgUnit}
                            handleClickOrgUnit={this.handleClickOrgUnit} 
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <ProgramSelector
                            selectedProgram={this.props.selectedProgramId}
                            handleChangeProgram={this.handleChangeProgram}
                            handleClickProgram={this.handleClickProgram}
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
