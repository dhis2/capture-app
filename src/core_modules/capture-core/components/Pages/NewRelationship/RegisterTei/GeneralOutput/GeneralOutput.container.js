// @flow
import { connect } from 'react-redux';
import React from 'react';
import GeneralOutput from './GeneralOutput.component';
import getDataEntryKey from '../../../../DataEntry/common/getDataEntryKey';

const mapStateToProps = (state: ReduxState, { id }) => {
    const registerTeiContainer = state.newRelationshipRegisterTei;
    const ready = !registerTeiContainer.loading;

    const dataEntryId = id || 'relationship';
    const dataEntryKey = ready ? getDataEntryKey(dataEntryId, state.dataEntries[dataEntryId].itemId) : null;
    return {
        ready,
        dataEntryKey,
    };
};

// $FlowFixMe[missing-annot] automated comment
export default connect(mapStateToProps, () => ({}))(
    (props: Object) => (props.ready ? <GeneralOutput {...props} /> : null),
);
