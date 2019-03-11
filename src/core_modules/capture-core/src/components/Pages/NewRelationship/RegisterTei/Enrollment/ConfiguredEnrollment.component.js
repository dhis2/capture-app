// @flow
import {
    withSaveHandler,
} from '../../../../DataEntry';
import {
    EnrollmentDataEntry,
} from '../../../../DataEntries';
import withMainButton from './withMainButton';

const SaveHandlerHOC =
    withSaveHandler(
        { onGetFormFoundation: (props: Object) => props.enrollmentMetadata.enrollmentForm })(
        withMainButton()(EnrollmentDataEntry));

export default SaveHandlerHOC;
