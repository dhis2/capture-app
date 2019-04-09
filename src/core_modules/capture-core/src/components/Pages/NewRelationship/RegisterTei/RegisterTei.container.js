// @flow
import { connect } from 'react-redux';
import withLoadingIndicator from '../../../../HOC/withLoadingIndicator';
import withErrorMessageHandler from '../../../../HOC/withErrorMessageHandler';
import RegisterTei from './RegisterTei.component';
import { makeTETNameSelector } from './registerTei.selectors';
import { reviewDuplicates } from './GeneralOutput/WarningSection/SearchGroupDuplicate/searchGroupDuplicate.actions';
import getDataEntryKey from '../../../DataEntry/common/getDataEntryKey';

const makeStateToProps = () => {
    const tetNameSelector = makeTETNameSelector();
    const mapStateToProps = (state: ReduxState) => {
        const ready = !state.newRelationshipRegisterTei.loading;
        const dataEntryId = 'relationship';
        const dataEntryKey = ready ? getDataEntryKey(dataEntryId, state.dataEntries[dataEntryId].itemId) : null;

        return {
            tetName: tetNameSelector(state),
            ready,
            error: state.newRelationshipRegisterTei.error,
            possibleDuplicates: !!(state.dataEntriesSearchGroupsResults[dataEntryKey] &&
                state.dataEntriesSearchGroupsResults[dataEntryKey].main &&
                state.dataEntriesSearchGroupsResults[dataEntryKey].main.count),
        };
    };
    // $FlowFixMe
    return mapStateToProps;
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onReviewDuplicates: (onOpenReviewDialog: Function) => {
        dispatch(reviewDuplicates());
        onOpenReviewDialog();
    },
});

// $FlowSuppress
export default connect(makeStateToProps, mapDispatchToProps)(
    withLoadingIndicator()(
        withErrorMessageHandler()(
            RegisterTei,
        ),
    ),
);
