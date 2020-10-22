// @flow
import { type ComponentType } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import withLoadingIndicator from '../../../../HOC/withLoadingIndicator';
import withErrorMessageHandler from '../../../../HOC/withErrorMessageHandler';
import { RegisterTeiComponent } from './RegisterTei.component';
import { makeTETNameSelector } from './registerTei.selectors';
import { reviewDuplicates } from './GeneralOutput/WarningsSection/SearchGroupDuplicate/searchGroupDuplicate.actions';
import getDataEntryKey from '../../../DataEntry/common/getDataEntryKey';
import type { Props, OwnProps } from './RegisterTei.types';

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
    onReviewDuplicates: (pageSize) => { dispatch(reviewDuplicates(pageSize)); },
});

export const RegisterTei: ComponentType<OwnProps> = compose(
    connect<$Diff<Props, CssClasses>, OwnProps, _, _, _, _>(makeStateToProps, mapDispatchToProps),
    withLoadingIndicator(),
    withErrorMessageHandler(),
)(RegisterTeiComponent);
