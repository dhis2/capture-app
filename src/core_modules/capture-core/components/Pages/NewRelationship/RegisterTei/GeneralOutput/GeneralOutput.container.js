// @flow
import { connect } from 'react-redux';
import React from 'react';
import GeneralOutput from './GeneralOutput.component';
import getDataEntryKey from '../../../../DataEntry/common/getDataEntryKey';

const mapStateToProps = (state: ReduxState) => {
    const registerTeiContainer = state.newRelationshipRegisterTei;
    const ready = !registerTeiContainer.loading && !registerTeiContainer.dataEntryIsLoading;

    const dataEntryId = 'relationship';
    const dataEntryKey = ready ? getDataEntryKey(dataEntryId, state.dataEntries[dataEntryId].itemId) : null;
    return {
        ready,
        dataEntryKey,
    };
};

// $FlowSuppress
// $FlowFixMe[missing-annot] automated comment
export default connect(mapStateToProps, () => ({}))(
    (props: Object) => (props.ready ? <GeneralOutput {...props} /> : null),
);
