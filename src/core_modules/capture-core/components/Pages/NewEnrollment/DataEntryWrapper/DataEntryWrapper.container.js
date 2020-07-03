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

   
    // $FlowFixMe[not-an-object] automated comment
    return mapStateToProps;
};

const mapDispatchToProps = () => ({
});

// $FlowSuppress
// $FlowFixMe[missing-annot] automated comment
export default connect(makeMapStateToProps, mapDispatchToProps)(DataEntryWrapper);
