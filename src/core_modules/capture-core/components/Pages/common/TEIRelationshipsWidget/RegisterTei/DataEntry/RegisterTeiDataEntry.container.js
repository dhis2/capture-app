import { compose } from 'redux';
import { connect } from 'react-redux';
import { RegisterTeiDataEntryComponent } from './RegisterTeiDataEntry.component';
import { withErrorMessageHandler } from '../../../../../../HOC/withErrorMessageHandler';

const mapStateToProps = (state) => ({
    showDataEntry: state.newRelationshipRegisterTei.orgUnit,
    error: state.newRelationshipRegisterTei.dataEntryError,
    programId: state.newRelationshipRegisterTei.programId,
});

const mapDispatchToProps = () => ({});

export const RegisterTeiDataEntry =
  compose(
      connect(mapStateToProps, mapDispatchToProps),
      withErrorMessageHandler(),
  )(RegisterTeiDataEntryComponent);
