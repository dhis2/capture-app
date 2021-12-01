// @flow
import { connect } from 'react-redux';
import { NewEnrollmentRelationship } from './DataEntryEnrollment.component';
import { makeEnrollmentMetadataSelector } from './enrollment.selectors';

const makeMapStateToProps = () => {
    const enrollmentMetadataSelector = makeEnrollmentMetadataSelector();

    const mapStateToProps = (state: ReduxState) => {
        const enrollmentMetadata = enrollmentMetadataSelector(state);

        return {
            enrollmentMetadata,
            programId: state.newRelationshipRegisterTei.programId,
        };
    };
    // $FlowFixMe[not-an-object] automated comment
    return mapStateToProps;
};

// $FlowFixMe
export const DataEntryEnrollment = connect(makeMapStateToProps, () => ({}))(NewEnrollmentRelationship);
