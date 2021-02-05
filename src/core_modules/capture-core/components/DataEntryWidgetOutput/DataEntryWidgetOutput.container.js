// @flow
import { connect } from 'react-redux';
import { type ComponentType } from 'react';
import { compose } from 'redux';
import { DataEntryWidgetOutputComponent } from './DataEntryWidgetOutput.component';
import getDataEntryKey from '../DataEntry/common/getDataEntryKey';
import { withLoadingIndicator } from '../../HOC';

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
  compose(
      connect(mapStateToProps, () => ({}))(DataEntryWidgetOutputComponent),
      withLoadingIndicator(),
  );
