// @flow
import React, { Component } from 'react';

import QuickSelector from '../../../QuickSelector/QuickSelector.container';
import NewEvent from '../NewEvent.container';
import WarningDialog from './WarningDialog.components';
import withLoadHandler from '../withLoadHandler';
import i18n from '@dhis2/d2-i18n';

type Props = {
    onSetOrgUnit: (id: string, orgUnit: Object) => void,
    onResetOrgUnitId: () => void,
    onSetProgramId: (id: string) => void,
    onSetCategoryOption: (categoryId: string, categoryOptionId: string) => void,
    onResetCategoryOption: (categoryId: string) => void,
    onResetAllCategoryOptions: () => void,
    onStartAgain: () => void,
    onResetProgramId: (baseAction: ReduxAction<any, any>) => void,
};

type State = {
    openStartAgainWarning: boolean;
    openOrgUnitWarning: boolean;
    openProgramWarning: ?Object; // uses the base action as open state for now
    openCatComboWarning: boolean;
    categoryIdToReset: string;
    openNewEventWarning: boolean;
};

class EditEventSelector extends Component<Props, State> {
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
        this.setState({ openStartAgainWarning: true });
    }

    handleOpenOrgUnitWarning() {
        this.setState({ openOrgUnitWarning: true });
    }

    handleOpenProgramWarning(baseAction: ReduxAction<any, any>) {
        this.setState({ openProgramWarning: baseAction });
    }

    handleOpenCatComboWarning(categoryId) {
        this.setState({ openCatComboWarning: true, categoryIdToReset: categoryId });
    }


    handleClose() {
        this.setState({ openStartAgainWarning: false, openOrgUnitWarning: false, openProgramWarning: null, openCatComboWarning: false, openNewEventWarning: false });
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
        this.setState({ openNewEventWarning: true });
    }

    handleAcceptNew() {
        this.props.onStartAgain();
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
                <NewEvent />
                <WarningDialog onAcceptClick={this.handleAcceptStartAgain} open={this.state.openStartAgainWarning} onClose={this.handleClose} titleText={i18n.t('Start Again')} contentText={i18n.t('Are you sure? All unsaved data will be lost')} />
                <WarningDialog onAcceptClick={this.handleAcceptOrgUnit} open={this.state.openOrgUnitWarning} onClose={this.handleClose} titleText={i18n.t('Reset Organisation Unit')} contentText={i18n.t('Are you sure? All unsaved data will be lost')} />
                <WarningDialog onAcceptClick={this.handleAcceptProgram} open={!!this.state.openProgramWarning} onClose={this.handleClose} titleText={i18n.t('Reset Program')} contentText={i18n.t('Are you sure? All unsaved data will be lost')} />
                <WarningDialog onAcceptClick={this.handleAcceptCatCombo} open={this.state.openCatComboWarning} onClose={this.handleClose} titleText={i18n.t('Reset Category Option')} contentText={i18n.t('Are you sure? All unsaved data will be lost')} />
                <WarningDialog onAcceptClick={this.handleAcceptNew} open={this.state.openNewEventWarning} onClose={this.handleClose} titleText={i18n.t('Create New Event')} contentText={i18n.t('Are you sure? All unsaved data will be lost')} />
            </div>
        );
    }
}

export default withLoadHandler()(EditEventSelector);
