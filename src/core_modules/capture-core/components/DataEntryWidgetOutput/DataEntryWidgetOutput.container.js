// @flow
import { connect } from 'react-redux';
import React, { type ComponentType } from 'react';
import { DataEntryWidgetOutputComponent } from './DataEntryWidgetOutput.component';
import { getDataEntryKey } from '../DataEntry/common/getDataEntryKey';
import type { RenderCustomCardActions } from '../CardList/CardList.types';

type OwnProps = {|
    renderCardActions?: RenderCustomCardActions,
    dataEntryId: string,
    selectedScopeId: string,
|}
const mapStateToProps = (state: ReduxState, { dataEntryId }) => {
    const { dataEntries } = state;
    const ready = !!dataEntries[dataEntryId];

    const dataEntryKey = ready ? getDataEntryKey(dataEntryId, state.dataEntries[dataEntryId].itemId) : null;
    return {
        ready,
        dataEntryKey,
    };
};

export const DataEntryWidgetOutput: ComponentType<OwnProps> =
  connect(mapStateToProps, () => ({}))(
      (props: Object) => (props.ready ? <DataEntryWidgetOutputComponent {...props} /> : null),
  );
