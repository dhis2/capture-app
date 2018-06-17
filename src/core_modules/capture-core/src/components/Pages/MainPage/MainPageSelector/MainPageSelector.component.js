// @flow
import React, { Component } from 'react';

import withLoadHandler from '../withLoadHandler';
import QuickSelector from '../../../QuickSelector/QuickSelector.container';
import MainPage from '../MainPage.container';

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

class MainPageSelector extends Component<Props> {
    handleStartAgain: () => void;
    handleResetProgramId: () => void;
    handleClickNew: () => void;

    constructor(props) {
        super(props);

        this.handleStartAgain = this.handleStartAgain.bind(this);
        this.handleResetProgramId = this.handleResetProgramId.bind(this);
        this.handleClickNew = this.handleClickNew.bind(this);
    }

    handleStartAgain() {
        this.props.onResetOrgUnitId();
        this.props.onResetProgramId();
        this.props.onResetAllCategoryOptions();
    }

    handleResetProgramId() {
        this.props.onResetProgramId();
        this.props.onResetAllCategoryOptions();
    }

    handleClickNew() {
        this.props.onOpenNewEventPage(this.props.selectedProgramId, this.props.selectedOrgUnitId);
    }

    render() {
        return (
            <div>
                <QuickSelector
                    onSetOrgUnit={this.props.onSetOrgUnit}
                    onResetOrgUnitId={this.props.onResetOrgUnitId}
                    onSetProgramId={this.props.onSetProgramId}
                    onResetProgramId={this.handleResetProgramId}
                    onSetCategoryOption={this.props.onSetCategoryOption}
                    onResetCategoryOption={this.props.onResetCategoryOption}
                    onResetAllCategoryOptions={this.props.onResetAllCategoryOptions}
                    onStartAgain={this.handleStartAgain}
                    onClickNew={this.handleClickNew}
                />
                <MainPage />
            </div>
        );
    }
}

export default withLoadHandler()(MainPageSelector);
