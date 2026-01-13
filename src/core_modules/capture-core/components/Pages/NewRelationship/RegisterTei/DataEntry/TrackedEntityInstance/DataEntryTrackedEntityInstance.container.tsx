import { connect } from 'react-redux';
import { makeTeiRegistrationMetadataSelector } from './tei.selectors';
import { RelationshipTrackedEntityInstance } from './DataEntryTrackedEntityInstance.component';
import type { ReduxState } from '../../../../../App/withAppUrlSync.types';

const makeMapStateToProps = () => {
    const teiRegistrationMetadataSelector = makeTeiRegistrationMetadataSelector();

    const mapStateToProps = (state: ReduxState) => {
        const teiRegistrationMetadata = teiRegistrationMetadataSelector(state);

        return { teiRegistrationMetadata };
    };
    return mapStateToProps;
};

export const DataEntryTrackedEntityInstance = connect(
    makeMapStateToProps,
    () => ({}),
)(RelationshipTrackedEntityInstance as any);
