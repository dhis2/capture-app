// @flow
import {
    withSaveHandler,
    withDataEntryField,
    withCancelButton,
} from '../../../../DataEntry';
import {
    EnrollmentDataEntry,
} from '../../../../DataEntries';
import withMainButton from './withMainButton';
/*
const getCancelOptions = () => ({
    color: 'primary',
});
const CancelButtonHOC = withCancelButton(getCancelOptions)(EnrollmentDataEntry);
*/



const programSelectorHOC = withDataEntryField()(EnrollmentDataEntry);
const SaveHandlerHOC =
    withSaveHandler(
        { onGetFormFoundation: (props: Object) => props.enrollmentMetadata.enrollmentForm })(
        withMainButton()(programSelectorHOC));

export default SaveHandlerHOC;
