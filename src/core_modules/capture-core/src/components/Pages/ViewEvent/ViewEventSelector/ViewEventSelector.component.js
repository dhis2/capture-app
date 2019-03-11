// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import QuickSelector from '../../../QuickSelector/QuickSelector.container';
import ViewEvent from '../ViewEvent.container';
import ConfirmDialog from '../../../Dialogs/ConfirmDialog.component';
import ViewEventNewRelationshipWrapper from '../Relationship/ViewEventNewRelationshipWrapper.container';

type Props = {
    selectedOrgUnitId: string,
    selectedProgramId: string,
    onSetOrgUnit: (id: string, orgUnit: Object) => void,
    onResetOrgUnitId: () => void,
    onSetProgramId: (id: string) => void,
    onSetCategoryOption: (categoryId: string, categoryOptionId: string) => void,
    onResetCategoryOption: (categoryId: string) => void,
    onResetAllCategoryOptions: () => void,
    onOpenNewEventPage: (programId: string, orgUnitId: string) => void,
    onStartAgain: () => void,
    onResetProgramId: (baseAction: ReduxAction<any, any>) => void,
    formInputInProgress: boolean,
    showAddRelationship?: ?boolean,
};

type State = {
    openStartAgainWarning: boolean;
    openOrgUnitWarning: boolean;
    openProgramWarning: ?Object; // uses the base action as open state for now
    openCatComboWarning: boolean;
    categoryIdToReset: string;
    openNewWarning: boolean;
};

const defaultDialogProps = {
    header: i18n.t('Unsaved changes'),
    text: i18n.t('Leaving this page will discard the changes you made to this event.'),
    confirmText: i18n.t('Yes, discard'),
    cancelText: i18n.t('No, stay here'),
};

class ViewEventSelector extends Component<Props, State> {
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

    constructor(props: Props) {
        super(props);

        this.state = {
            openStartAgainWarning: false,
            openOrgUnitWarning: false,
            openProgramWarning: null,
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
        if (!this.props.formInputInProgress) {
            this.props.onStartAgain();
            return;
        }
        this.setState({ openStartAgainWarning: true });
    }

    handleOpenOrgUnitWarning() {
        if (!this.props.formInputInProgress) {
            this.props.onResetOrgUnitId();
            return;
        }
        this.setState({ openOrgUnitWarning: true });
    }

    handleOpenProgramWarning(baseAction: ReduxAction<any, any>) {
        if (!this.props.formInputInProgress) {
            this.props.onResetProgramId(baseAction);
            return;
        }
        this.setState({ openProgramWarning: baseAction });
    }

    handleOpenCatComboWarning(categoryId: string) {
        if (!this.props.formInputInProgress) {
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
            openNewWarning: false });
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
        if (!this.props.formInputInProgress) {
            this.props.onOpenNewEventPage(this.props.selectedProgramId, this.props.selectedOrgUnitId);
        }
        this.setState({ openNewWarning: true });
    }

    handleAcceptNew() {
        this.props.onOpenNewEventPage(this.props.selectedProgramId, this.props.selectedOrgUnitId);
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
                {this.props.showAddRelationship ?
                    <ViewEventNewRelationshipWrapper /> :
                    <ViewEvent />
                }
                <ConfirmDialog onConfirm={this.handleAcceptStartAgain} open={this.state.openStartAgainWarning} onCancel={this.handleClose} {...defaultDialogProps} />
                <ConfirmDialog onConfirm={this.handleAcceptOrgUnit} open={this.state.openOrgUnitWarning} onCancel={this.handleClose} {...defaultDialogProps} />
                <ConfirmDialog onConfirm={this.handleAcceptProgram} open={!!this.state.openProgramWarning} onCancel={this.handleClose} {...defaultDialogProps} />
                <ConfirmDialog onConfirm={this.handleAcceptCatCombo} open={this.state.openCatComboWarning} onCancel={this.handleClose} {...defaultDialogProps} />
                <ConfirmDialog onConfirm={this.handleAcceptNew} open={this.state.openNewWarning} onCancel={this.handleClose} {...defaultDialogProps} />
            </div>
        );
    }
}

export default (ViewEventSelector);
