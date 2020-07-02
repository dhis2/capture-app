// @flow
import { connect } from 'react-redux';
import DataEntryWrapper from './DataEntryWrapper.component';
import { makeEnrollmentMetadataSelector } from './dataEntryWrapper.selectors';


const makeMapStateToProps = () => {
    const enrollmentMetadataSelector = makeEnrollmentMetadataSelector();

    const mapStateToProps = (state: ReduxState) => {
        const enrollmentMetadata = enrollmentMetadataSelector(state);

        return {
            enrollmentMetadata,
        };
    };

    // $FlowSuppress
    return mapStateToProps;
};

const mapDispatchToProps = () => ({
});

// $FlowSuppress
export default connect(makeMapStateToProps, mapDispatchToProps)(DataEntryWrapper);
