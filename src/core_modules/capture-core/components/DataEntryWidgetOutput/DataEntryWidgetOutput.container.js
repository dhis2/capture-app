// @flow
import { connect } from 'react-redux';
import React, { type ComponentType } from 'react';
import GeneralOutputComponent from './DataEntryWidgetOutput.component';
import getDataEntryKey from '../DataEntry/common/getDataEntryKey';

type OwnProps = {|
    onLink?: (teiId: string) => void,
    dataEntryId: string,
    selectedScopeId: string,
|}
const mapStateToProps = (state: ReduxState, { dataEntryId }) => {
    const registerTeiContainer = state.newRelationshipRegisterTei;
    const ready = !registerTeiContainer.loading;

    const dataEntryKey = ready ? getDataEntryKey(dataEntryId, state.dataEntries[dataEntryId].itemId) : null;
    return {
        ready,
        dataEntryKey,
    };
};

export const DataEntryWidgetOutput: ComponentType<OwnProps> =
  connect(mapStateToProps, () => ({}))(
      (props: Object) => (props.ready ? <GeneralOutputComponent {...props} /> : null),
  );
