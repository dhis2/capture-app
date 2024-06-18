// @flow
import React, { Component, type ComponentType } from 'react';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core';
import { QuickSelector } from './QuickSelector/QuickSelector.component';
import { DiscardDialog } from '../Dialogs/DiscardDialog.component';
import { defaultDialogProps } from '../Dialogs/DiscardDialog.constants';
import type { Props, State } from './ScopeSelector.types';
import { withLoadingIndicator } from '../../HOC';

const styles = {
    stickyTopBar: {
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
    },
};

class ScopeSelectorClass extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            openOrgUnitWarning: false,
            openProgramWarning: null,
            openCatComboWarning: false,
            openStartAgainWarning: false,
            categoryIdToReset: '',
        };
    }

    dontShowWarning = () => !this.props.isUserInteractionInProgress;

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
            this.props.onResetCategoryOption && this.props.onResetCategoryOption(categoryId);
            return;
        }
        this.setState({ openCatComboWarning: true, categoryIdToReset: categoryId });
    }

    handleStartAgainWarning = () => {
        if (this.dontShowWarning()) {
            this.props.onStartAgain && this.props.onStartAgain();
            return;
        }
        this.setState({ openStartAgainWarning: true });
    }

    handleClose = () => {
        this.setState({
            openOrgUnitWarning: false,
            openProgramWarning: null,
            openCatComboWarning: false,
            openStartAgainWarning: false,
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

    handleAcceptStartAgain = () => {
        this.props.onStartAgain && this.props.onStartAgain();
        this.handleClose();
    }

    render() {
        const { onSetOrgUnit, onSetProgramId, onSetCategoryOption, onResetAllCategoryOptions } = this.props;

        return (
            <div
                className={this.props.classes.stickyTopBar}
                data-test={'scope-selector'}
            >
                <QuickSelector
                    onSetOrgUnit={onSetOrgUnit}
                    onSetProgramId={onSetProgramId}
                    onSetCategoryOption={onSetCategoryOption}
                    onResetAllCategoryOptions={onResetAllCategoryOptions}
                    onResetOrgUnitId={this.handleOpenOrgUnitWarning}
                    onResetProgramId={this.handleOpenProgramWarning}
                    onResetCategoryOption={this.handleOpenCatComboWarning}
                    onStartAgain={this.handleStartAgainWarning}
                    previousOrgUnitId={this.props.previousOrgUnitId}
                    selectedOrgUnitId={this.props.selectedOrgUnitId}
                    selectedProgramId={this.props.selectedProgramId}
                    selectedOrgUnit={this.props.selectedOrgUnit}
                    selectedCategories={this.props.selectedCategories}
                    isUserInteractionInProgress={this.props.isUserInteractionInProgress}
                    formIsOpen={this.props.formIsOpen}
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
                    onDestroy={this.handleAcceptStartAgain}
                    open={this.state.openStartAgainWarning}
                    onCancel={this.handleClose}
                    {...defaultDialogProps}
                />
            </div>
        );
    }
}

export const ScopeSelectorComponent: ComponentType<$Diff<Props, CssClasses>> = compose(
    withLoadingIndicator(() => ({ height: '100px' })),
    withStyles(styles),
)(ScopeSelectorClass);
