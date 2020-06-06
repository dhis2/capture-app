// @flow
import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
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
    }


    handleClose=() => {
        this.setState({
            openStartAgainWarning: false,
            openOrgUnitWarning: false,
            openProgramWarning: null,
            openCatComboWarning: false,
            openNewWarning: false });
    }

    handleAcceptStartAgain = () => {
        this.props.onStartAgain();
        this.handleClose();
    }

    handleAcceptOrgUnit = () => {
        this.props.onResetOrgUnitId();
        this.handleClose();
    }

    handleAcceptProgram=() => {
        this.props.onResetProgramId(this.state.openProgramWarning);
        this.handleClose();
    }

    handleAcceptCatCombo=() => {
        this.props.onResetCategoryOption(this.state.categoryIdToReset);
        this.handleClose();
    }

    handleAcceptNew=() => {
        this.props.onOpenNewEventPage(this.props.selectedProgramId, this.props.selectedOrgUnitId);
        this.handleClose();
    }

    render() {
        return (
            <div>
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

export default ViewEventSelector;
