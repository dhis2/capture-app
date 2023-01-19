// @flow
import React, { Component, type ComponentType } from 'react';
import { compose } from 'redux';
import { QuickSelector } from './QuickSelector/QuickSelector.component';
import { DiscardDialog } from '../Dialogs/DiscardDialog.component';
import { defaultDialogProps, savingInProgressDialogProps } from '../Dialogs/DiscardDialog.constants';
import type { Props, State } from './ScopeSelector.types';
import { withLoadingIndicator } from '../../HOC';

class ScopeSelectorClass extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            openOrgUnitWarning: false,
            openProgramWarning: null,
            openCatComboWarning: false,
            openSavingInProgress: false,
            categoryIdToReset: '',
            contextChangeFallback: null,
        };
    }

    shouldShowWarning = () => this.props.isUserInteractionInProgress;
    isSavingInProgress = () => this.props.isSavingInProgress;

    handleOpenOrgUnitWarning = () => {
        if (this.isSavingInProgress()) {
            this.setState({ openSavingInProgress: true, contextChangeFallback: this.props.onResetOrgUnitId });
            this.props.onContextChangeWhileSaving();
            return;
        } else if (this.shouldShowWarning()) {
            this.setState({ openOrgUnitWarning: true });
            return;
        }

        this.props.onResetOrgUnitId();
    }

    handleOpenProgramWarning = (baseAction: ReduxAction<any, any>) => {
        if (this.isSavingInProgress()) {
            this.setState({
                openSavingInProgress: true,
                contextChangeFallback: () => this.props.onResetProgramId(baseAction),
            });
            this.props.onContextChangeWhileSaving();
            return;
        } else if (this.shouldShowWarning()) {
            this.setState({ openProgramWarning: baseAction });
            return;
        }
        this.props.onResetProgramId(baseAction);
    }

    handleOpenCatComboWarning = (categoryId: string) => {
        if (this.isSavingInProgress()) {
            this.setState({
                openSavingInProgress: true,
                contextChangeFallback: () => this.props.onResetCategoryOption && this.props.onResetCategoryOption(categoryId),
            });
            this.props.onContextChangeWhileSaving();
            return;
        } else if (this.shouldShowWarning()) {
            this.setState({ openCatComboWarning: true, categoryIdToReset: categoryId });
            return;
        }
        this.props.onResetCategoryOption && this.props.onResetCategoryOption(categoryId);
    }

    handleClose = () => {
        this.setState({
            openOrgUnitWarning: false,
            openProgramWarning: null,
            openCatComboWarning: false,
            openSavingInProgress: false,
        });
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
        this.props.onResetCategoryOption && this.props.onResetCategoryOption(this.state.categoryIdToReset);
        this.handleClose();
    }

    handleAcceptContextChange = () => {
        this.state.contextChangeFallback && this.state.contextChangeFallback();
        this.setState({ contextChangeFallback: null });
        this.handleClose();
    }

    handleCancelContextChange = () => {
        this.handleClose();
        this.props.onCancelContextChange();
    }

    render() {
        const { onSetOrgUnit, onSetProgramId, onSetCategoryOption, onResetAllCategoryOptions } = this.props;

        return (
            <div data-test={'scope-selector'}>
                <QuickSelector
                    onSetOrgUnit={onSetOrgUnit}
                    onSetProgramId={onSetProgramId}
                    onSetCategoryOption={onSetCategoryOption}
                    onResetAllCategoryOptions={onResetAllCategoryOptions}
                    onResetOrgUnitId={this.handleOpenOrgUnitWarning}
                    onResetProgramId={this.handleOpenProgramWarning}
                    onResetCategoryOption={this.handleOpenCatComboWarning}
                    previousOrgUnitId={this.props.previousOrgUnitId}
                    selectedOrgUnitId={this.props.selectedOrgUnitId}
                    selectedProgramId={this.props.selectedProgramId}
                    selectedOrgUnit={this.props.selectedOrgUnit}
                    selectedCategories={this.props.selectedCategories}
                >
                    {this.props.children}
                </QuickSelector>
                <DiscardDialog
                    onDestroy={this.handleAcceptOrgUnit}
                    open={this.state.openOrgUnitWarning}
                    onCancel={this.handleClose}
                    {...defaultDialogProps}
                />
                <DiscardDialog
                    onDestroy={this.handleAcceptProgram}
                    open={!!this.state.openProgramWarning}
                    onCancel={this.handleClose}
                    {...defaultDialogProps}
                />
                <DiscardDialog
                    onDestroy={this.handleAcceptCatCombo}
                    open={this.state.openCatComboWarning}
                    onCancel={this.handleClose}
                    {...defaultDialogProps}
                />
                <DiscardDialog
                    onConfirm={this.handleAcceptContextChange}
                    open={this.state.openSavingInProgress}
                    onCancel={this.handleCancelContextChange}
                    {...savingInProgressDialogProps}
                />
            </div>
        );
    }
}

export const ScopeSelectorComponent: ComponentType<$Diff<Props, CssClasses>> = compose(
    withLoadingIndicator(() => ({ height: '100px' })),
)(ScopeSelectorClass);
