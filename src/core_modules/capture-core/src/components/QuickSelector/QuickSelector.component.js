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

class QuickSelector extends Component {
    constructor(props) {
        super(props);
        this.state = { selectedProgram: '', selectedOrgUint: '' };

        this.handleChangeProgram = this.handleChangeProgram.bind(this);
        this.handleClickProgram = this.handleClickProgram.bind(this);

        this.handleChangeOrgUnit = this.handleChangeOrgUnit.bind(this);
        this.handleClickOrgUnit = this.handleClickOrgUnit.bind(this);

        this.handleClickReset = this.handleClickReset.bind(this);
    }

    handleChangeProgram(program) {
        this.setState({ selectedProgram: program });
    }

    handleClickProgram(program) {
        this.setState({ selectedProgram: program });
    }

    handleChangeOrgUnit(orgUnit) {
        this.setState({ selectedOrgUint: orgUnit });
    }

    handleClickOrgUnit(orgUnit) {
        this.setState({ selectedOrgUint: orgUnit });
    }

    handleClickReset() {
        this.setState({ selectedProgram: '', selectedOrgUint: '' });
    }

    // TODO: Add support for cat-combos.
    render() {
        return (
            <Paper className={this.props.classes.paper}>
                <Grid container spacing={24}>
                    <Grid item xs={12} sm={4}>
                        <OrgUnitSelector selectedOrgUint={this.props.selectedOrgUnit} handleChangeOrgUnit={this.handleChangeOrgUnit} handleClickOrgUnit={this.handleClickOrgUnit} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <ProgramSelector selectedProgram={this.props.selectedProgramId} handleChangeProgram={this.handleChangeProgram} handleClickProgram={this.handleClickProgram} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <ActionButtons handleClickReset={this.handleClickReset} selectedProgram={this.props.selectedProgramId} selectedOrgUint={this.state.selectedOrgUint.id} />
                    </Grid>
                </Grid>
                <p>OrgUnitID: {this.props.selectedOrgUnit.id} - ProgramID: {this.props.selectedProgramId}</p>
            </Paper>
        );
    }
}

export default withStyles(styles)(QuickSelector);
