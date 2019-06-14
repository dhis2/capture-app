// @flow
import { connect } from 'react-redux';
import DataEntryWrapper from './DataEntryWrapper.component';
/*
import {
    setNewEventFormLayoutDirection,
} from './newEventDataEntryWrapper.actions';
*/
import {
    makeEnrollmentMetadataSelector,
} from './dataEntryWrapper.selectors';
// import getDataEntryHasChanges from '../getNewEventDataEntryHasChanges';


const makeMapStateToProps = () => {
    const enrollmentMetadataSelector = makeEnrollmentMetadataSelector();

    const mapStateToProps = (state: ReduxState) => {
        const enrollmentMetadata = enrollmentMetadataSelector(state);

        return {
            enrollmentMetadata,
            // dataEntryHasChanges: getDataEntryHasChanges(state),
            // formHorizontal: (formFoundation && formFoundation.customForm ? false : !!state.newEventPage.formHorizontal),
        };
    };

    // $FlowSuppress
    return mapStateToProps;
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    /*
    onFormLayoutDirectionChange: (formHorizontal: boolean) => {
        dispatch(setNewEventFormLayoutDirection(formHorizontal));
    },
    */
});

// $FlowSuppress
export default connect(makeMapStateToProps, mapDispatchToProps)(DataEntryWrapper);
