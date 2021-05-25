// @flow
import { connect } from 'react-redux';
import { makeTeiRegistrationMetadataSelector } from './tei.selectors';
import { RelationshipTrackedEntityInstance } from './DataEntryTrackedEntityInstance.component';

const makeMapStateToProps = () => {
    const teiRegistrationMetadataSelector = makeTeiRegistrationMetadataSelector();

    const mapStateToProps = (state: ReduxState) => {
        const teiRegistrationMetadata = teiRegistrationMetadataSelector(state);

        return { teiRegistrationMetadata };
    };
    // $FlowFixMe[not-an-object] automated comment
    return mapStateToProps;
};

// $FlowFixMe[missing-annot] automated comment
export const DataEntryTrackedEntityInstance = connect(
    makeMapStateToProps,
    () => ({}),
)(RelationshipTrackedEntityInstance);
