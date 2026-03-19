import { connect } from 'react-redux';
import { RegisterTeiDataEntryComponent } from './RegisterTeiDataEntry.component';
import type { ReduxState } from '../../../../App/withAppUrlSync.types';

const mapStateToProps = (state: ReduxState) => ({
    showDataEntry: !!state.newRelationshipRegisterTei.orgUnit,
    error: state.newRelationshipRegisterTei.dataEntryError,
    programId: state.newRelationshipRegisterTei.programId,
});

const mapDispatchToProps = () => ({});

export const RegisterTeiDataEntry = connect(mapStateToProps, mapDispatchToProps)(RegisterTeiDataEntryComponent);
