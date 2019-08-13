// @flow
import {
    withSaveHandler,
    withCancelButton,
} from '../../../DataEntry';
import {
    EnrollmentDataEntry,
} from '../../../DataEntries';
import withMainButton from './withMainButton';

const getCancelOptions = () => ({
    color: 'primary',
});
const CancelButtonHOC = withCancelButton(getCancelOptions)(EnrollmentDataEntry);

const SaveHandlerHOC =
    withSaveHandler(
        { onGetFormFoundation: (props: Object) => props.enrollmentMetadata.enrollmentForm })(
        withMainButton()(CancelButtonHOC));

export default SaveHandlerHOC;
