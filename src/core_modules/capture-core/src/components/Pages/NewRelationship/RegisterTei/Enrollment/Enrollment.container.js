// @flow
import { connect } from 'react-redux';
import {
    makeEnrollmentMetadataSelector,
} from './enrollment.selectors';
import withLoadingIndicator from '../../../../../HOC/withLoadingIndicator';
import NewEnrollmentRelationship from './Enrollment.component';

const makeMapStateToProps = () => {
    const enrollmentMetadataSelector = makeEnrollmentMetadataSelector();

    const mapStateToProps = (state: ReduxState) => {
        const enrollmentMetadata = enrollmentMetadataSelector(state);

        return {
            enrollmentMetadata,
            programId: state.newRelationshipRegisterTei.programId,
            orgUnitId: state.newRelationshipRegisterTei.orgUnitId,
            ready: !state.newRelationship.loading,
        };
    };
    return mapStateToProps;
};

// $FlowSuppress
export default connect(makeMapStateToProps, () => ({}))(
    withLoadingIndicator()(NewEnrollmentRelationship));
