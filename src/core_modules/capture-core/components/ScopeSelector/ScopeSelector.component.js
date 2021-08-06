// @flow
import React, { Component, type ComponentType } from 'react';
import { compose } from 'redux';
import i18n from '@dhis2/d2-i18n';
import { QuickSelector } from './QuickSelector/QuickSelector.container';
import { ConfirmDialog } from '../Dialogs/ConfirmDialog.component';
import type { Props, State } from './ScopeSelector.types';
import { withLoadingIndicator } from '../../HOC';

const defaultDialogProps = {
    header: i18n.t('Unsaved changes'),
    text: i18n.t('Leaving this page will discard the changes you made to this event.'),
    confirmText: i18n.t('Yes, discard'),
    cancelText: i18n.t('No, stay here'),
};


class ScopeSelectorClass extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            openStartAgainWarning: false,
            openOrgUnitWarning: false,
            openProgramWarning: null,
            openCatComboWarning: false,
            categoryIdToReset: '',
            openNewEventWarning: false,
        };
    }

    dontShowWarning = () => !this.props.isUserInteractionInProgress;

    handleOpenStartAgainWarning=() => {
        if (this.dontShowWarning()) {
            this.props.onStartAgain();
            return;
        }
        this.setState({ openStartAgainWarning: true });
    }

    openNewRegistrationPage = () => {
        if (this.props.isUserInteractionInProgress) {
            this.setState({ openStartAgainWarning: true });
            return;
        }
        this.props.onOpenNewEventPage();
    }

    handleOpenNewRegistrationPageWithoutProgramId = () => {
        if (this.dontShowWarning()) {
            this.props.onOpenNewRegistrationPageWithoutProgramId();
            return;
        }
        this.setState({ openStartAgainWarning: true });
    }

    handleOpenSearchPage = () => {
        if (this.dontShowWarning()) {
            this.props.onOpenSearchPage();
            return;
        }
        this.setState({ openStartAgainWarning: true });
    }

    handleOpenSearchPageWithoutProgramId = () => {
        if (this.dontShowWarning()) {
            this.props.onOpenSearchPageWithoutProgramId();
            return;
        }
        this.setState({ openStartAgainWarning: true });
    }

    handleOpenOrgUnitWarning = () => {
        if (this.dontShowWarning()) {
            this.props.onResetOrgUnitId();
            return;
        }
        this.setState({ openOrgUnitWarning: true });
    }

    handleOpenProgramWarning = (baseAction: ReduxAction<any, any>) => {
        if (this.dontShowWarning()) {
            this.props.onResetProgramId(baseAction);
            return;
        }
        this.setState({ openProgramWarning: baseAction });
    }

    handleOpenCatComboWarning = (categoryId: string) => {
        if (this.dontShowWarning()) {
            this.props.onResetCategoryOption(categoryId);
            return;
        }
        this.setState({ openCatComboWarning: true, categoryIdToReset: categoryId });
    }

    handleClose = () => {
        this.setState({
            openStartAgainWarning: false,
            openOrgUnitWarning: false,
            openProgramWarning: null,
            openCatComboWarning: false,
            openNewEventWarning: false,
        });
    }

    handleAcceptStartAgain = () => {
        this.props.onStartAgain();
        this.handleClose();
    }

    handleAcceptOrgUnit = () => {
        this.props.onResetOrgUnitId();
        this.handleClose();
    }

    handleAcceptProgram = () => {
        if (this.state.openProgramWarning) {
            this.props.onResetProgramId(this.state.openProgramWarning);
        }
        this.handleClose();
    }

    handleAcceptCatCombo = () => {
        this.props.onResetCategoryOption(this.state.categoryIdToReset);
        this.handleClose();
    }

    handleAcceptNew = () => {
        this.props.onOpenNewEventPage();
        this.handleClose();
    }

    render() {
        const { onSetOrgUnit, onSetProgramId, onSetCategoryOption, onResetAllCategoryOptions } = this.props;
        return (
            <div data-test={'locked-selector'}>
                <QuickSelector
                    onSetOrgUnit={onSetOrgUnit}
                    onSetProgramId={onSetProgramId}
                    onSetCategoryOption={onSetCategoryOption}
                    onResetAllCategoryOptions={onResetAllCategoryOptions}
                    onResetOrgUnitId={this.handleOpenOrgUnitWarning}
                    onResetProgramId={this.handleOpenProgramWarning}
                    onResetCategoryOption={this.handleOpenCatComboWarning}
                    onStartAgain={this.handleOpenStartAgainWarning}
                    onNewClick={this.openNewRegistrationPage}
                    onNewClickWithoutProgramId={this.handleOpenNewRegistrationPageWithoutProgramId}
                    onFindClick={this.handleOpenSearchPage}
                    onFindClickWithoutProgramId={this.handleOpenSearchPageWithoutProgramId}
                />
                <ConfirmDialog
                    onConfirm={this.handleAcceptStartAgain}
                    open={this.state.openStartAgainWarning}
                    onCancel={this.handleClose}
                    {...defaultDialogProps}
                />
                <ConfirmDialog
                    onConfirm={this.handleAcceptOrgUnit}
                    open={this.state.openOrgUnitWarning}
                    onCancel={this.handleClose}
                    {...defaultDialogProps}
                />
                <ConfirmDialog
                    onConfirm={this.handleAcceptProgram}
                    open={!!this.state.openProgramWarning}
                    onCancel={this.handleClose}
                    {...defaultDialogProps}
                />
                <ConfirmDialog
                    onConfirm={this.handleAcceptCatCombo}
                    open={this.state.openCatComboWarning}
                    onCancel={this.handleClose}
                    {...defaultDialogProps}
                />
                <ConfirmDialog
                    onConfirm={this.handleAcceptNew}
                    open={this.state.openNewEventWarning}
                    onCancel={this.handleClose}
                    {...defaultDialogProps}
                />
            </div>
        );
    }
}

export const ScopeSelectorComponent: ComponentType<$Diff<Props, CssClasses>> = compose(
    withLoadingIndicator(() => ({ height: '100px' })),
)(ScopeSelectorClass);
