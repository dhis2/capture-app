import { connect } from 'react-redux';
import { ExistingTEILoaderComponent } from './ExistingTEILoader.component';

const mapStateToProps = (state: any) => ({
    programId: state.newRelationshipRegisterTei.programId,
});

export const ExistingTEILoader = connect(mapStateToProps, () => ({}))(ExistingTEILoaderComponent as any);
