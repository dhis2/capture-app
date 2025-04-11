import { connect } from 'react-redux';
import { RegisterTeiDataEntryComponent } from './RegisterTeiDataEntry.component';
import { withErrorMessageHandler } from '../../../../../../HOC/withErrorMessageHandler';

interface State {
    newRelationshipRegisterTei: {
        orgUnit: any;
        dataEntryError: string;
        programId: string;
    };
}

const mapStateToProps = (state: State) => ({
    showDataEntry: state.newRelationshipRegisterTei.orgUnit,
    error: state.newRelationshipRegisterTei.dataEntryError,
    programId: state.newRelationshipRegisterTei.programId,
});

const mapDispatchToProps = () => ({});

const WithErrorHandler = withErrorMessageHandler()(RegisterTeiDataEntryComponent);
export const RegisterTeiDataEntry = connect(mapStateToProps, mapDispatchToProps)(WithErrorHandler);
