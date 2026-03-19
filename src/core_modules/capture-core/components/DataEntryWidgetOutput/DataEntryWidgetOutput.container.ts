import { connect } from 'react-redux';
import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { DataEntryWidgetOutputComponent } from './DataEntryWidgetOutput.component';
import { getDataEntryKey } from '../DataEntry/common/getDataEntryKey';
import { makeProgramRulesSelector } from './DataEntryWidgetOutput.selectors';

type OwnProps = {
    dataEntryId: string;
    selectedScopeId: string;
};

const makeMapStateToProps = () => {
    const programRulesSelector = makeProgramRulesSelector();

    return (state: any, { dataEntryId, selectedScopeId }: OwnProps) => {
        const { dataEntries } = state;
        const ready = !!dataEntries[dataEntryId];
        const dataEntryKey = ready ? getDataEntryKey(dataEntryId, state.dataEntries[dataEntryId].itemId) : null;

        return {
            ready,
            dataEntryKey,
            programRules: programRulesSelector(state, { dataEntryId, selectedScopeId }),
            feedbackEmptyText: i18n.t('No feedback for this enrollment yet'),
            indicatorEmptyText: i18n.t('No indicator output for this enrollment yet'),
        };
    };
};

export const DataEntryWidgetOutput: ComponentType<OwnProps> =
  connect(makeMapStateToProps, () => ({}))(
      (props: any) => (props.ready ? React.createElement(DataEntryWidgetOutputComponent, props) : null),
  );
