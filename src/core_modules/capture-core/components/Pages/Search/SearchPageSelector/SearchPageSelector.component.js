// @flow
import React, { Component } from 'react';
import QuickSelector from '../../../QuickSelector/QuickSelector.container';

type Props = {
    selectedOrgUnitId: string,
    selectedProgramId: string,
    onSetOrgUnit: (id: string, orgUnit: Object) => void,
    onResetOrgUnitId: () => void,
    onSetProgramId: (id: string) => void,
    onSetCategoryOption: (categoryId: string, categoryOption: Object) => void,
    onResetCategoryOption: (categoryId: string) => void,
    onResetAllCategoryOptions: () => void,
    onOpenNewEventPage: (programId: string, orgUnitId: string) => void,
    onStartAgain: () => void,
    onResetProgramId: (baseAction: ReduxAction<any, any>) => void,
};

class SearchPageSelector extends Component<Props> {
    handleStartAgain: () => void;
    handleClickNew: () => void;

    constructor(props: Props) {
        super(props);

        this.handleStartAgain = this.handleStartAgain.bind(this);
        this.handleClickNew = this.handleClickNew.bind(this);
    }

    handleStartAgain() {
        this.props.onStartAgain();
    }

    handleClickNew() {
        this.props.onOpenNewEventPage(this.props.selectedProgramId, this.props.selectedOrgUnitId);
    }

    render() {
        const {
            onSetOrgUnit,
            onResetOrgUnitId,
            onSetProgramId,
            onResetProgramId,
            onSetCategoryOption,
            onResetCategoryOption,
            onResetAllCategoryOptions,
        } = this.props;

        return (
          <div>
              <QuickSelector
                onSetOrgUnit={onSetOrgUnit}
                onResetOrgUnitId={onResetOrgUnitId}
                onSetProgramId={onSetProgramId}
                onResetProgramId={onResetProgramId}
                onSetCategoryOption={onSetCategoryOption}
                onResetCategoryOption={onResetCategoryOption}
                onResetAllCategoryOptions={onResetAllCategoryOptions}
                onStartAgain={this.handleStartAgain}
                onClickNew={this.handleClickNew}
              />
          </div>
        );
    }
}

export default SearchPageSelector;
