// @flow
import { connect } from 'react-redux';
import {
    makeTeiRegistrationMetadataSelector,
} from './tei.selectors';
import TrackedEntityInstance from './TrackedEntityInstance.component';

const makeMapStateToProps = () => {
    const teiRegistrationMetadataSelector = makeTeiRegistrationMetadataSelector();

    const mapStateToProps = (state: ReduxState) => {
        const teiRegistrationMetadata = teiRegistrationMetadataSelector(state);

        return {
            teiRegistrationMetadata,
            orgUnit: state.newRelationshipRegisterTei.orgUnit,
        };
    };
    return mapStateToProps;
};

// $FlowSuppress
export default connect(makeMapStateToProps, () => ({}))(TrackedEntityInstance);
