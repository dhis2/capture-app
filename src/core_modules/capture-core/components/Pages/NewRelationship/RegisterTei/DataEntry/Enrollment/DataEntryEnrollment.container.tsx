import { connect } from 'react-redux';
import { makeEnrollmentMetadataSelector } from './enrollment.selectors';
import { NewEnrollmentRelationship } from './DataEntryEnrollment.component';

type ReduxState = {
    newRelationshipRegisterTei: {
        programId: string;
        orgUnit: { id: string };
    };
};

const makeMapStateToProps = () => {
    const enrollmentMetadataSelector = makeEnrollmentMetadataSelector();

    const mapStateToProps = (state: ReduxState) => {
        const enrollmentMetadata = enrollmentMetadataSelector(state);

        return {
            enrollmentMetadata,
            programId: state.newRelationshipRegisterTei.programId,
            orgUnitId: state.newRelationshipRegisterTei.orgUnit.id,
        };
    };
    return mapStateToProps;
};

export const DataEntryEnrollment = connect(makeMapStateToProps, () => ({}))(NewEnrollmentRelationship as any);
