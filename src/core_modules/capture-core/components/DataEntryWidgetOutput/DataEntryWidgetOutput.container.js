// @flow
import { type ComponentType } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { DataEntryWidgetOutputComponent } from './DataEntryWidgetOutput.component';
import getDataEntryKey from '../DataEntry/common/getDataEntryKey';
import { withLoadingIndicator } from '../../HOC';

type OwnProps = {|
    onLink?: (teiId: string) => void,
    dataEntryId: string,
    selectedScopeId: string,
    eventAccess?: { read: boolean, write: boolean },
    ready: boolean,
|}

const mapStateToProps = (state: ReduxState, { dataEntryId, ready }) => ({
    ready,
    dataEntryKey: ready ? getDataEntryKey(dataEntryId, state.dataEntries[dataEntryId].itemId) : null,
});

export const DataEntryWidgetOutput: ComponentType<OwnProps> =
  compose(
      connect(mapStateToProps, () => ({})),
      withLoadingIndicator(),
  )(DataEntryWidgetOutputComponent);
