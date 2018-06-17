// @flow
import React, { Component } from 'react';

import QuickSelector from '../../../QuickSelector/QuickSelector.container';
import EditEvent from '../EditEvent.container';

import WarningDialog from './WarningDialog.component';

type Props = {
    selectedOrgUnitId: string,
    selectedProgramId: string,
    onSetOrgUnit: (id: string, orgUnit: Object) => void,
    onResetOrgUnitId: () => void,
    onSetProgramId: (id: string) => void,
    onResetProgramId: () => void,
    onSetCategoryOption: (categoryId: string, categoryOptionId: string) => void,
    onResetCategoryOption: (categoryId: string) => void,
    onResetAllCategoryOptions: () => void,
    onOpenNewEventPage: (programId: string, orgUnitId: string) => void,
};

class EditEventSelector extends Component<Props> {
    handleOpenStartAgainWarning: () => void;
    handleOpenOrgUnitWarning: () => void;
    handleOpenProgramWarning: () => void;
    handleOpenCatComboWarning: (categoryId: string) => void;
    handleClose: () => void;
    handleAcceptStartAgain: () => void;
    handleAcceptOrgUnit: () => void;
    handleAcceptProgram: () => void;
    handleAcceptCatCombo: () => void;
    handleClickNew: () => void;
    handleAcceptNew: () => void;
    state: {
        openStartAgainWarning: boolean;
        openOrgUnitWarning: boolean;
        openProgramWarning: boolean;
        openCatComboWarning: boolean;
        categoryIdToReset: string;
        openNewWarning: boolean;
    };

    constructor(props) {
        super(props);

        this.state = {
            openStartAgainWarning: false,
            openOrgUnitWarning: false,
            openProgramWarning: false,
            openCatComboWarning: false,
            categoryIdToReset: '',
            openNewWarning: false,
        };

        this.handleOpenStartAgainWarning = this.handleOpenStartAgainWarning.bind(this);
        this.handleOpenOrgUnitWarning = this.handleOpenOrgUnitWarning.bind(this);
        this.handleOpenProgramWarning = this.handleOpenProgramWarning.bind(this);
        this.handleOpenCatComboWarning = this.handleOpenCatComboWarning.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleAcceptStartAgain = this.handleAcceptStartAgain.bind(this);
        this.handleAcceptOrgUnit = this.handleAcceptOrgUnit.bind(this);
        this.handleAcceptProgram = this.handleAcceptProgram.bind(this);
        this.handleAcceptCatCombo = this.handleAcceptCatCombo.bind(this);
        this.handleClickNew = this.handleClickNew.bind(this);
        this.handleAcceptNew = this.handleAcceptNew.bind(this);
    }

    handleOpenStartAgainWarning() {
        this.setState({ openStartAgainWarning: true });
    }

    handleOpenOrgUnitWarning() {
        this.setState({ openOrgUnitWarning: true });
    }

    handleOpenProgramWarning() {
        this.setState({ openProgramWarning: true });
    }

    handleOpenCatComboWarning(categoryId) {
        this.setState({ openCatComboWarning: true, categoryIdToReset: categoryId });
    }


    handleClose() {
        this.setState({ openStartAgainWarning: false, openOrgUnitWarning: false, openProgramWarning: false, openCatComboWarning: false, openNewWarning: false });
    }

    handleAcceptStartAgain() {
        this.props.onResetOrgUnitId();
        this.props.onResetProgramId();
        this.props.onResetAllCategoryOptions();
    }

    handleAcceptOrgUnit() {
        this.props.onResetOrgUnitId();
    }

    handleAcceptProgram() {
        this.props.onResetProgramId();
        this.props.onResetAllCategoryOptions();
    }

    handleAcceptCatCombo() {
        this.props.onResetCategoryOption(this.state.categoryIdToReset);
        this.handleClose();
    }

    handleClickNew() {
        this.setState({ openNewWarning: true });
    }

    handleAcceptNew() {
        this.props.onOpenNewEventPage(this.props.selectedProgramId, this.props.selectedOrgUnitId);
    }

    render() {
        return (
            <div>
                <QuickSelector
                    onSetOrgUnit={this.props.onSetOrgUnit}
                    onResetOrgUnitId={this.handleOpenOrgUnitWarning}
                    onSetProgramId={this.props.onSetProgramId}
                    onResetProgramId={this.handleOpenProgramWarning}
                    onSetCategoryOption={this.props.onSetCategoryOption}
                    onResetCategoryOption={this.handleOpenCatComboWarning}
                    onResetAllCategoryOptions={this.props.onResetAllCategoryOptions}
                    onStartAgain={this.handleOpenStartAgainWarning}
                    onClickNew={this.handleClickNew}
                />
                <EditEvent />
                <WarningDialog onAcceptClick={this.handleAcceptStartAgain} open={this.state.openStartAgainWarning} onClose={this.handleClose} titleText="Start Again" contentText="Are you sure? All unsaved data will be lost." />
                <WarningDialog onAcceptClick={this.handleAcceptOrgUnit} open={this.state.openOrgUnitWarning} onClose={this.handleClose} titleText="Reset Organisation Unit" contentText="Are you sure? All unsaved data will be lost." />
                <WarningDialog onAcceptClick={this.handleAcceptProgram} open={this.state.openProgramWarning} onClose={this.handleClose} titleText="Reset Program" contentText="Are you sure? All unsaved data will be lost." />
                <WarningDialog onAcceptClick={this.handleAcceptCatCombo} open={this.state.openCatComboWarning} onClose={this.handleClose} titleText="Reset Category Option" contentText="Are you sure? All unsaved data will be lost." />
                <WarningDialog onAcceptClick={this.handleAcceptNew} open={this.state.openNewWarning} onClose={this.handleClose} titleText="Create New Event" contentText="Are you sure? All unsaved data will be lost." />
            </div>
        );
    }
}

export default (EditEventSelector);
