import type { ComponentType } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { RegisterTeiDataEntryComponent } from './RegisterTeiDataEntry.component';
import { withErrorMessageHandler } from '../../../../../../HOC/withErrorMessageHandler';
import type { Props } from './RegisterTeiDataEntry.types';

const mapStateToProps = (state: any) => ({
    showDataEntry: state.newRelationshipRegisterTei.orgUnit,
    error: state.newRelationshipRegisterTei.dataEntryError,
    programId: state.newRelationshipRegisterTei.programId,
});

const mapDispatchToProps = () => ({});

type StateProps = ReturnType<typeof mapStateToProps>;
type OwnProps = Omit<Props, keyof StateProps>;

export const RegisterTeiDataEntry = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withErrorMessageHandler(),
)(RegisterTeiDataEntryComponent) as ComponentType<OwnProps>;
