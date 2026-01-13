import { connect } from 'react-redux';
import React, { type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { DataEntryWidgetOutputComponent } from './DataEntryWidgetOutput.component';
import { getDataEntryKey } from '../DataEntry/common/getDataEntryKey';

type OwnProps = {
    dataEntryId: string;
    selectedScopeId: string;
};

const mapStateToProps = (state: any, { dataEntryId }: { dataEntryId: string }) => {
    const { dataEntries } = state;
    const ready = !!dataEntries[dataEntryId];

    const dataEntryKey = ready ? getDataEntryKey(dataEntryId, state.dataEntries[dataEntryId].itemId) : null;
    return {
        ready,
        dataEntryKey,
        feedbackEmptyText: i18n.t('No feedback for this enrollment yet'),
        indicatorEmptyText: i18n.t('No indicator output for this enrollment yet'),
    };
};

export const DataEntryWidgetOutput: ComponentType<OwnProps> =
  connect(mapStateToProps, () => ({}))(
      (props: any) => (props.ready ? React.createElement(DataEntryWidgetOutputComponent, props) : null),
  );
