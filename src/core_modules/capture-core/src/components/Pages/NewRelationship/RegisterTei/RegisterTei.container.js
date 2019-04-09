// @flow
import { connect } from 'react-redux';
import withLoadingIndicator from '../../../../HOC/withLoadingIndicator';
import withErrorMessageHandler from '../../../../HOC/withErrorMessageHandler';
import RegisterTei from './RegisterTei.component';
import { makeTETNameSelector } from './registerTei.selectors';
import getDataEntryKey from '../../../DataEntry/common/getDataEntryKey';

const makeStateToProps = () => {
    const tetNameSelector = makeTETNameSelector();
    const mapStateToProps = (state: ReduxState) => {
        const dataEntryId = 'relationship';
        const dataEntryKey = getDataEntryKey(dataEntryId, state.dataEntries[dataEntryId].itemId);

        return {
            tetName: tetNameSelector(state),
            ready: !state.newRelationshipRegisterTei.loading,
            error: state.newRelationshipRegisterTei.error,
            possibleDuplicates: !!(state.dataEntriesSearchGroupsResults[dataEntryKey] &&
                state.dataEntriesSearchGroupsResults[dataEntryKey].main &&
                state.dataEntriesSearchGroupsResults[dataEntryKey].main.count),
        };
    };
    // $FlowFixMe
    return mapStateToProps;
};

const mapDispatchToProps = () => ({
});

// $FlowSuppress
export default connect(makeStateToProps, mapDispatchToProps)(
    withLoadingIndicator()(
        withErrorMessageHandler()(
            RegisterTei,
        ),
    ),
);
