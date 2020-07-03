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
    // $FlowFixMe[not-an-object] automated comment
    return mapStateToProps;
};

// $FlowSuppress
// $FlowFixMe[missing-annot] automated comment
export default connect(makeMapStateToProps, () => ({}))(TrackedEntityInstance);
