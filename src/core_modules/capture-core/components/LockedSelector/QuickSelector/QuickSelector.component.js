// @flow

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { colors } from '@dhis2/ui';
import programs from 'capture-core/metaDataMemoryStores/programCollection/programCollection';

import ProgramSelector from './Program/ProgramSelector.component';
import OrgUnitSelector from './OrgUnitSelector.component';
import { ActionButtons } from './ActionButtons.component';
import { SingleLockedSelect } from './SingleLockedSelect.component';
import { pageKeys } from '../../App/withAppUrlSync';

const styles = ({ palette }) => ({
    paper: {
        flexGrow: 1,
    },
    programSelector: {
        backgroundColor: palette.grey.lighter,
        borderRight: `1px solid ${colors.grey500}`,
        margin: '0 0 0 -1px',
    },
    orgUnitSelector: {
        backgroundColor: palette.grey.lighter,
        margin: '0 0 0 -1px',
        borderRight: `1px solid ${colors.grey500}`,
        borderLeft: `1px solid ${colors.grey500}`,
    },
});

type Props = {
    selectedOrgUnitId: string,
    selectedProgramId: string,
    selectedCategories: Object,
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
    onNewClick: () => void,
    onFindClick: () => void,
    onFindClickWithoutProgramId: () => void,
    currentPage: string,
    selectedTrackedEntityTypeName: string,
    onTrackedEntityInstanceClear: () => void,
};

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
        const { currentPage, selectedTrackedEntityTypeName, onTrackedEntityInstanceClear } = this.props;

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
                        currentPage === pageKeys.ENROLLMENT &&
                        <>
                            <Grid item xs={12} sm={width * 3} md={width * 2} lg={2} className={this.props.classes.orgUnitSelector}>
                                <SingleLockedSelect
                                    onClear={onTrackedEntityInstanceClear}
                                    options={[
                                        {
                                            label: selectedTrackedEntityTypeName,
                                            value: selectedTrackedEntityTypeName,
                                        },
                                    ]}
                                    selectedText={selectedTrackedEntityTypeName}
                                    title={i18n.t('Selected Tracked Entity Type')}
                                />
                            </Grid>
                        </>

                    }
                    <Grid item xs={12} sm={width * 3} md={width * 2} lg={2} >
                        <ActionButtons
                            selectedProgramId={this.props.selectedProgramId}
                            onStartAgainClick={this.props.onStartAgain}
                            onFindClick={this.props.onFindClick}
                            onFindClickWithoutProgramId={this.props.onFindClickWithoutProgramId}
                            onNewClick={this.props.onNewClick}
                            showResetButton={!!(this.props.selectedProgramId || this.props.selectedOrgUnitId)}
                        />
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

export default withStyles(styles)(QuickSelector);
