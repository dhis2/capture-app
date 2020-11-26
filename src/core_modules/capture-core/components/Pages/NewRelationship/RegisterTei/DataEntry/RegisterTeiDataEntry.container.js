// @flow
import { connect } from 'react-redux';
import DataEntry from './RegisterTeiDataEntry.component';
import withErrorMessageHandler from '../../../../../HOC/withErrorMessageHandler';
import withLoadingIndicator from '../../../../../HOC/withLoadingIndicator';

const mapStateToProps = (state: ReduxState) => ({
    showDataEntry: state.newRelationshipRegisterTei.orgUnit,
    ready: !state.newRelationshipRegisterTei.dataEntryIsLoading,
    error: state.newRelationshipRegisterTei.dataEntryError,
    programId: state.newRelationshipRegisterTei.programId,
});

const mapDispatchToProps = () => ({});

// $FlowFixMe[missing-annot] automated comment
export const RegisterTeiDataEntry = connect(mapStateToProps, mapDispatchToProps)(
    withLoadingIndicator()(
        withErrorMessageHandler()(
            DataEntry,
        ),
    ),
);
