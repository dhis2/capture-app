// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withErrorMessageHandler } from '../../../../../HOC/withErrorMessageHandler';
import { RegisterTeiDataEntryComponent } from './RegisterTeiDataEntry.component';

const mapStateToProps = (state: ReduxState) => ({
    showDataEntry: state.newRelationshipRegisterTei.orgUnit,
    error: state.newRelationshipRegisterTei.dataEntryError,
    programId: state.newRelationshipRegisterTei.programId,
});

const mapDispatchToProps = () => ({});

export const RegisterTeiDataEntry =
  compose(
      // $FlowFixMe[missing-annot] automated comment
      connect(mapStateToProps, mapDispatchToProps),
      withErrorMessageHandler(),
  )(RegisterTeiDataEntryComponent);
