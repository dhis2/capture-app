// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import QuickSelector from '../../../QuickSelector/QuickSelector.container';
import IsSelectionsCompleteLevel from '../IsSelectionsCompleteLevel/IsSelectionsCompleteLevel.container';
import ConfirmDialog from '../../../Dialogs/ConfirmDialog.component';
import withLoadHandler from './withLoadHandler';

const defaultDialogProps = {
    header: i18n.t('Discard event?'),
    text: i18n.t('Leaving this page will discard the changes you made to this event.'),
    confirmText: i18n.t('Discard'),
    cancelText: i18n.t('Back to event'),
};

type Props = {
    onSetOrgUnit: (id: string, orgUnit: Object) => void,
    onResetOrgUnitId: () => void,
    onSetProgramId: (id: string) => void,
    onSetCategoryOption: (categoryId: string, categoryOptionId: string) => void,
    onResetCategoryOption: (categoryId: string) => void,
    onResetAllCategoryOptions: () => void,
    onStartAgain: () => void,
    onResetProgramId: (baseAction: ReduxAction<any, any>) => void,
    formInputInProgess: boolean,
    onResetDataEntry: () => void,
};

type State = {
    openStartAgainWarning: boolean;
    openOrgUnitWarning: boolean;
    openProgramWarning: ?Object; // uses the base action as open state for now
    openCatComboWarning: boolean;
    categoryIdToReset: string;
    openNewEventWarning: boolean;
};

class SelectorLevel extends Component<Props, State> {
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

    constructor(props) {
        super(props);

        this.state = {
            openStartAgainWarning: false,
            openOrgUnitWarning: false,
            openProgramWarning: null,
            openCatComboWarning: false,
            categoryIdToReset: '',
            openNewEventWarning: false,
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
        if (!this.props.formInputInProgess) {
            this.props.onStartAgain();
            return;
        }
        this.setState({ openStartAgainWarning: true });
    }

    handleOpenOrgUnitWarning() {
        if (!this.props.formInputInProgess) {
            this.props.onResetOrgUnitId();
            return;
        }
        this.setState({ openOrgUnitWarning: true });
    }

    handleOpenProgramWarning(baseAction: ReduxAction<any, any>) {
        if (!this.props.formInputInProgess) {
            this.props.onResetProgramId(baseAction);
            return;
        }
        this.setState({ openProgramWarning: baseAction });
    }

    handleOpenCatComboWarning(categoryId) {
        if (!this.props.formInputInProgess) {
            this.props.onResetCategoryOption(categoryId);
            return;
        }
        this.setState({ openCatComboWarning: true, categoryIdToReset: categoryId });
    }

    handleClose() {
        this.setState({
            openStartAgainWarning: false,
            openOrgUnitWarning: false,
            openProgramWarning: null,
            openCatComboWarning: false,
            openNewEventWarning: false,
        });
    }

    handleAcceptStartAgain() {
        this.props.onStartAgain();
        this.handleClose();
    }

    handleAcceptOrgUnit() {
        this.props.onResetOrgUnitId();
        this.handleClose();
    }

    handleAcceptProgram() {
        this.props.onResetProgramId(this.state.openProgramWarning);
        this.handleClose();
    }

    handleAcceptCatCombo() {
        this.props.onResetCategoryOption(this.state.categoryIdToReset);
        this.handleClose();
    }

    handleClickNew() {
        if (!this.props.formInputInProgess) {
            return;
        }
        this.setState({ openNewEventWarning: true });
    }

    handleAcceptNew() {
        this.props.onResetDataEntry();
        this.handleClose();
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
                <IsSelectionsCompleteLevel />
                <ConfirmDialog onConfirm={this.handleAcceptStartAgain} open={this.state.openStartAgainWarning} onCancel={this.handleClose} {...defaultDialogProps} />
                <ConfirmDialog onConfirm={this.handleAcceptOrgUnit} open={this.state.openOrgUnitWarning} onCancel={this.handleClose} {...defaultDialogProps} />
                <ConfirmDialog onConfirm={this.handleAcceptProgram} open={!!this.state.openProgramWarning} onCancel={this.handleClose} {...defaultDialogProps} />
                <ConfirmDialog onConfirm={this.handleAcceptCatCombo} open={this.state.openCatComboWarning} onCancel={this.handleClose} {...defaultDialogProps} />
                <ConfirmDialog onConfirm={this.handleAcceptNew} open={this.state.openNewEventWarning} onCancel={this.handleClose} {...defaultDialogProps} />
            </div>
        );
    }
}

export default withLoadHandler()(SelectorLevel);
