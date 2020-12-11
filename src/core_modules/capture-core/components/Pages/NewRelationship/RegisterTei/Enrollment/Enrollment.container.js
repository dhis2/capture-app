// @flow
import { connect } from 'react-redux';
import { makeEnrollmentMetadataSelector } from './enrollment.selectors';
import NewEnrollmentRelationship from './Enrollment.component';

const makeMapStateToProps = () => {
  const enrollmentMetadataSelector = makeEnrollmentMetadataSelector();

  const mapStateToProps = (state: ReduxState) => {
    const enrollmentMetadata = enrollmentMetadataSelector(state);

    return {
      enrollmentMetadata,
      programId: state.newRelationshipRegisterTei.programId,
      orgUnit: state.newRelationshipRegisterTei.orgUnit,
    };
  };
  // $FlowFixMe[not-an-object] automated comment
  return mapStateToProps;
};

// $FlowFixMe
export default connect(makeMapStateToProps, () => ({}))(NewEnrollmentRelationship);
