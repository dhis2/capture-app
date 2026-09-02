import { connect } from 'react-redux';
import React, { type ComponentType } from 'react';
import { DataEntryWidgetOutputComponent } from './DataEntryWidgetOutput.component';
import { getDataEntryKey } from '../DataEntry/common/getDataEntryKey';
import { makeProgramRulesSelector } from './DataEntryWidgetOutput.selectors';
import { getTermLabel } from '../../metaData';
import { tCustomTerm } from '../../utils/tCustomTerm';

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
        const enrollmentLabel = getTermLabel('enrollment', { programId: selectedScopeId });

        return {
            ready,
            dataEntryKey,
            programRules: programRulesSelector(state, { dataEntryId, selectedScopeId }),
            feedbackEmptyText: tCustomTerm('No feedback for this {{enrollmentLabel}} yet', { enrollmentLabel }),
            indicatorEmptyText: tCustomTerm('No indicator output for this {{enrollmentLabel}} yet', { enrollmentLabel }),
        };
    };
};

export const DataEntryWidgetOutput: ComponentType<OwnProps> =
  connect(makeMapStateToProps, () => ({}))(
      (props: any) => (props.ready ? React.createElement(DataEntryWidgetOutputComponent, props) : null),
  );
